'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Loader2, Upload, X, Crop, Link2 } from 'lucide-react';
import FocalPointPicker, { type FocalPoint } from '@/components/admin/blocks/FocalPointPicker';

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  pageId: string;
  folder?: string;
  fit?: 'cover' | 'contain';
  // When provided (together with aspectRatio), shows a "Nastavit výřez" button
  // that lets the admin pick which part of the photo stays visible when it's
  // cropped to that shape on the frontend — the uploaded photo is untouched.
  focal?: FocalPoint;
  onFocalChange?: (focal: FocalPoint) => void;
  aspectRatio?: number;
}

// Only ever try to delete our own uploaded files — never the static default
// logo path ("/logo.png") or anything else that isn't a real Storage file.
async function deleteIfStorageFile(url: string) {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return;
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // Already deleted or never existed — nothing to clean up.
  }
}

export default function PhotoUpload({
  value,
  onChange,
  pageId,
  folder = 'pages',
  fit = 'cover',
  focal,
  onFocalChange,
  aspectRatio = 1,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const path = `${folder}/${pageId}/${crypto.randomUUID()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const previousValue = value;
      onChange(url);
      await deleteIfStorageFile(previousValue);
    } catch {
      setError('Nahrání fotky se nezdařilo. Zkuste to prosím znovu.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    const previousValue = value;
    onChange('');
    await deleteIfStorageFile(previousValue);
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
          <Image
            src={value}
            alt=""
            fill
            className={fit === 'contain' ? 'object-contain p-3' : 'object-cover'}
            style={
              fit === 'contain' || !focal
                ? undefined
                : {
                    objectPosition: `${focal.x}% ${focal.y}%`,
                    ...(focal.zoom && focal.zoom > 1
                      ? { transform: `scale(${focal.zoom})`, transformOrigin: `${focal.x}% ${focal.y}%` }
                      : {}),
                  }
            }
            unoptimized
          />
          {onFocalChange && fit !== 'contain' && (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="absolute top-1.5 left-1.5 w-7 h-7 rounded-lg bg-black/60 hover:bg-[#c93838] text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
              aria-label="Nastavit výřez fotky"
              title="Nastavit výřez fotky"
            >
              <Crop className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 hover:bg-[#c93838] text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
            aria-label="Odebrat fotku"
            title="Odebrat fotku"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {onFocalChange && (
        <FocalPointPicker
          open={pickerOpen}
          src={value}
          aspectRatio={aspectRatio}
          value={focal}
          onChange={onFocalChange}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
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
        <span>{uploading ? 'Nahrávám…' : value ? 'Nahradit fotku' : 'Nahrát fotku'}</span>
      </button>

      {urlMode ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://… (odkaz na už nahranou fotku)"
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
          <span>Nebo vložit odkaz na už nahranou fotku</span>
        </button>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
