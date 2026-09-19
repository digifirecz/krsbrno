'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('ChunkLoadError')
    ) {
      if (typeof window !== 'undefined') {
        const lastReload = sessionStorage.getItem('chunk_load_retry');
        const now = Date.now();
        if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
          sessionStorage.setItem('chunk_load_retry', now.toString());
          window.location.reload();
          return;
        }
      }
    }
    console.error('Error boundary caught:', error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <h2 className="text-2xl font-bold font-serif text-neutral-900 mb-2">Chyba v zobrazení</h2>
      <p className="text-neutral-600 mb-6 max-w-md">Stránku se nepodařilo načíst nebo došlo k aktualizaci aplikace.</p>
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          } else {
            reset();
          }
        }}
        className="px-5 py-2.5 bg-[#c93838] hover:bg-[#b02f2f] text-white font-medium rounded-xl transition cursor-pointer shadow-sm"
      >
        Obnovit stránku
      </button>
    </div>
  );
}
