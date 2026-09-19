'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="cs">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center font-sans">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Něco se pokazilo</h2>
          <p className="text-neutral-600 mb-6 max-w-md">Zkuste prosím stránku znovu načíst.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-[#c93838] hover:bg-[#b02f2f] text-white font-medium rounded-xl transition cursor-pointer shadow-sm"
          >
            Obnovit stránku
          </button>
        </div>
      </body>
    </html>
  );
}
