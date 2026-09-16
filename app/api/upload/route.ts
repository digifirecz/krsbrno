import { NextResponse } from 'next/server';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getSession } from '@/lib/auth/session';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Supabase Storage replacement for the old local-disk uploader (couldn't
// survive on Vercel — serverless functions have no persistent disk). Images
// go in the `images` bucket, audio in the `audio` bucket, both public buckets
// created ahead of time in the Supabase dashboard. Object key layout mirrors
// the old filesystem layout: <folder>/<id>/<uuid>-<name>.<ext>.

type Kind = { bucket: 'images' | 'audio'; exts: Set<string>; max: number; label: string; contentTypes: Record<string, string> };

const IMAGE: Kind = {
  bucket: 'images',
  exts: new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']),
  max: 15 * 1024 * 1024,
  label: 'obrázku',
  contentTypes: {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
  },
};
const AUDIO: Kind = {
  bucket: 'audio',
  exts: new Set(['.mp3', '.m4a', '.aac', '.wav', '.ogg', '.opus']),
  max: 50 * 1024 * 1024, // matches Supabase's free-tier global file size cap
  label: 'zvuku',
  contentTypes: {
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.aac': 'audio/aac',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.opus': 'audio/opus',
  },
};

const ALLOWED_FOLDERS = new Set(['pages', 'articles', 'social', 'branding', 'sermons']);

const safeSegment = (v: string) => v.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);

// Denylist strip, not a full parser — good enough to kill the common script/
// event-handler XSS vectors in an uploaded SVG (e.g. a logo) without a new
// dependency. Legitimate vector art never needs any of these.
function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/(href|xlink:href)\s*=\s*"(\s*javascript:[^"]*)"/gi, '')
    .replace(/(href|xlink:href)\s*=\s*'(\s*javascript:[^']*)'/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '');
}

function safeName(original: string, fallback: string): string {
  const ext = path.extname(original).toLowerCase();
  const base =
    path
      .basename(original, path.extname(original))
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || fallback;
  return `${randomUUID()}-${base}${ext}`;
}

// Recovers {bucket, objectPath} from one of our own public Storage URLs, for
// DELETE. Rejects anything that isn't actually a public URL for one of our
// two known buckets — same defensive intent as the old path-traversal check.
function parseOwnPublicUrl(url: string): { bucket: 'images' | 'audio'; objectPath: string } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const match = parsed.pathname.match(/^\/storage\/v1\/object\/public\/(images|audio)\/(.+)$/);
  if (!match) return null;
  return { bucket: match[1] as 'images' | 'audio', objectPath: decodeURIComponent(match[2]) };
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizováno.' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');
  const folder = safeSegment(String(form.get('folder') || 'pages')) || 'pages';
  const id = safeSegment(String(form.get('pageId') || form.get('id') || 'misc')) || 'misc';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Chybí soubor.' }, { status: 400 });
  }
  if (!ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: 'Neplatná složka.' }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const kind: Kind | undefined = IMAGE.exts.has(ext) ? IMAGE : AUDIO.exts.has(ext) ? AUDIO : undefined;
  if (!kind) {
    return NextResponse.json({ error: 'Nepodporovaný formát souboru.' }, { status: 400 });
  }
  if (file.size > kind.max) {
    return NextResponse.json(
      { error: `Soubor ${kind.label} je větší než ${Math.round(kind.max / 1024 / 1024)} MB.` },
      { status: 413 },
    );
  }

  const name = safeName(file.name, kind.bucket);
  const objectPath = `${folder}/${id}/${name}`;

  let bytes = Buffer.from(await file.arrayBuffer());
  // SVGs can embed <script>/event-handler XSS that fires if the raw file is
  // opened directly in a browser tab — strip that before it's ever stored.
  if (ext === '.svg') bytes = Buffer.from(sanitizeSvg(bytes.toString('utf8')), 'utf8');

  const { error } = await supabaseAdmin.storage.from(kind.bucket).upload(objectPath, bytes, {
    contentType: kind.contentTypes[ext] || 'application/octet-stream',
    upsert: false,
  });
  if (error) {
    return NextResponse.json({ error: 'Nahrání se nezdařilo.' }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(kind.bucket).getPublicUrl(objectPath);
  return NextResponse.json({ url: data.publicUrl });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizováno.' }, { status: 401 });

  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  const parsed = url ? parseOwnPublicUrl(url) : null;
  if (!parsed) {
    return NextResponse.json({ error: 'Neplatná cesta.' }, { status: 400 });
  }
  await supabaseAdmin.storage.from(parsed.bucket).remove([parsed.objectPath]);
  return NextResponse.json({ ok: true });
}
