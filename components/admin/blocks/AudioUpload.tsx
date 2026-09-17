'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload, X, FileAudio, Link2 } from 'lucide-react';

interface AudioUploadProps {
  value: string;
  onChange: (url: string) => void;
  // Groups the file on disk: /audio/sermons/<id>/…
  id: string;
  folder?: string;
}

// Only ever try to delete our own uploaded files (Supabase Storage) — the
// server independently re-validates this (parseOwnPublicUrl in the upload
// route), so this is just a cheap pre-filter to skip the request otherwise.
async function deleteIfLocal(url: string) {
  if (!url || !url.includes('/storage/v1/object/public/audio/')) return;
  try {
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch {
    /* already gone */
  }
}

function fileLabel(url: string): string {
  try {
    const name = decodeURIComponent(url.split('/').pop() || url);
    // strip the "<uuid>-" prefix we add on upload
    return name.replace(/^[0-9a-f-]{36}-/, '');
  } catch {
    return url;
  }
}

export default function AudioUpload({ value, onChange, id, folder = 'sermons' }: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [urlMode, setUrlMode] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', folder);
      body.append('id', id);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || 'upload failed');
      const previous = value;
      onChange(json.url);
      await deleteIfLocal(previous);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'upload failed'
          ? err.message
          : 'Nahrání nahrávky se nezdařilo. Zkuste to prosím znovu.',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    const previous = value;
    onChange('');
    await deleteIfLocal(previous);
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center space-x-2 min-w-0 text-sm text-neutral-700">
              <FileAudio className="w-4 h-4 shrink-0 text-[#c93838]" />
              <span className="truncate font-medium">{fileLabel(value)}</span>
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer shrink-0"
              aria-label="Odebrat nahrávku"
              title="Odebrat nahrávku"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <audio controls preload="none" src={value} className="w-full">
            Váš prohlížeč nepodporuje přehrávání zvuku.
          </audio>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.opus"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-600 hover:border-[#c93838] hover:text-[#c93838] transition-colors cursor-pointer disabled:opacity-60"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <span>{uploading ? 'Nahrávám…' : value ? 'Nahradit nahrávku' : 'Nahrát nahrávku (mp3)'}</span>
      </button>

      {urlMode ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://… (odkaz na už nahraný soubor)"
            className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838]"
          />
          <button
            type="button"
            onClick={() => {
              if (urlDraft.trim()) onChange(urlDraft.trim());
              setUrlDraft('');
              setUrlMode(false);
            }}
            className="px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#c93838] hover:bg-[#b02f2f] cursor-pointer shrink-0"
          >
            Použít
          </button>
          <button
            type="button"
            onClick={() => {
              setUrlMode(false);
              setUrlDraft('');
            }}
            className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 cursor-pointer shrink-0"
          >
            Zrušit
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setUrlMode(true)}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-neutral-400 hover:text-[#c93838] cursor-pointer"
        >
          <Link2 className="w-3 h-3" />
          <span>Nebo vložit odkaz na už nahraný soubor</span>
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
