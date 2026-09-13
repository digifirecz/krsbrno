'use client';

import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import { useSiteSettings } from '@/lib/useSiteSettings';

const STORAGE_KEY = 'krsbrno-cookie-consent';

interface CookieConsentValue {
  necessary: true;
  analytics: boolean;
  decidedAt: string;
}

function saveConsent(analytics: boolean) {
  const value: CookieConsentValue = { necessary: true, analytics, decidedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* localStorage unavailable (private mode etc.) — consent just won't persist */
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const siteSettings = useSiteSettings();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (analytics: boolean) => {
    saveConsent(analytics);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[70] w-[calc(100%-2rem)] max-w-xs animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="bg-white text-neutral-900 rounded-2xl border border-neutral-200 shadow-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold font-serif">Používáme cookies</p>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed font-sans">
            Nezbytné cookies používáme pro chod webu. Se souhlasem využijeme i cookies pro měření návštěvnosti.{' '}
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="text-[#c93838] hover:underline font-semibold cursor-pointer"
            >
              Více informací
            </button>
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleChoice(true)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#c93838] hover:bg-[#b02f2f] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Potvrdit vše
            </button>
            <button
              type="button"
              onClick={() => handleChoice(false)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-neutral-700 text-xs font-bold hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Pouze nezbytné
            </button>
          </div>
        </div>
      </div>

      {infoOpen && (
        <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-neutral-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif">Ochrana osobních údajů (GDPR)</h3>
              <button onClick={() => setInfoOpen(false)} className="text-neutral-400 hover:text-neutral-700 font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>
            {siteSettings?.gdprText ? (
              <div
                className="text-sm sm:text-base text-neutral-600 space-y-2 leading-relaxed max-h-80 overflow-y-auto font-sans [&_a]:text-[#c93838] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 last:[&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: siteSettings.gdprText }}
              />
            ) : (
              <p className="text-sm text-neutral-400">Text se právě načítá.</p>
            )}
            <button
              onClick={() => setInfoOpen(false)}
              className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              Zpět
            </button>
          </div>
        </div>
      )}
    </>
  );
}
