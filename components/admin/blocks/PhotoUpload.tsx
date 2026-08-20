'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Loader2, Upload, X } from 'lucide-react';

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  pageId: string;
  folder?: string;
  fit?: 'cover' | 'contain';
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

export default function PhotoUpload({ value, onChange, pageId, folder = 'pages', fit = 'cover' }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
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
          <Image src={value} alt="" fill className={fit === 'contain' ? 'object-contain p-3' : 'object-cover'} unoptimized />
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

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
