import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getSession } from '@/lib/auth/session';

// Local replacement for Firebase Storage uploads. Images land in
// public/image/<folder>/<id>/, audio in public/audio/<folder>/<id>/, served at
// /image/... or /audio/...

type Kind = { publicDir: 'image' | 'audio'; exts: Set<string>; max: number; label: string };

const IMAGE: Kind = {
  publicDir: 'image',
  exts: new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']),
  max: 15 * 1024 * 1024,
  label: 'obrázku',
};
const AUDIO: Kind = {
  publicDir: 'audio',
  exts: new Set(['.mp3', '.m4a', '.aac', '.wav', '.ogg', '.opus']),
  max: 300 * 1024 * 1024,
  label: 'zvuku',
};

const ALLOWED_FOLDERS = new Set(['pages', 'articles', 'social', 'branding', 'sermons']);
const IMAGE_ROOT = path.join(process.cwd(), 'public', 'image');
const AUDIO_ROOT = path.join(process.cwd(), 'public', 'audio');

const safeSegment = (v: string) => v.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);

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

  const name = safeName(file.name, kind.publicDir);
  const root = kind.publicDir === 'audio' ? AUDIO_ROOT : IMAGE_ROOT;
  const dir = path.join(root, folder, id);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/${kind.publicDir}/${folder}/${id}/${name}` });
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Neautorizováno.' }, { status: 401 });

  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  const root = url?.startsWith('/image/') ? IMAGE_ROOT : url?.startsWith('/audio/') ? AUDIO_ROOT : null;
  if (!url || !root) {
    return NextResponse.json({ error: 'Neplatná cesta.' }, { status: 400 });
  }
  const target = path.normalize(path.join(process.cwd(), 'public', url));
  if (!target.startsWith(root + path.sep)) {
    return NextResponse.json({ error: 'Mimo povolený adresář.' }, { status: 400 });
  }
  await unlink(target).catch(() => {});
  return NextResponse.json({ ok: true });
}
