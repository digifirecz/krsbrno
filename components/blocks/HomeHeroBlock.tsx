'use client';

import Image from 'next/image';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { getPathForTab } from '@/lib/routes';
import { focalCropStyle } from '@/lib/blocks/photoFocal';
import type { HomeHeroData } from '@/lib/blocks/types';

function renderTitle(title: string, highlightWord?: string) {
  if (!highlightWord) return title;
  const idx = title.indexOf(highlightWord);
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="text-[#c93838] relative inline-block">{highlightWord}</span>
      {title.slice(idx + highlightWord.length)}
    </>
  );
}

export default function HomeHeroBlock({ data }: { data: HomeHeroData }) {
  const primaryHref = data.buttonUrl || (data.buttonTarget ? getPathForTab(data.buttonTarget) : undefined);
  const secondaryHref = data.secondaryButtonUrl || (data.secondaryButtonTarget ? getPathForTab(data.secondaryButtonTarget) : undefined);
  const paragraphs = (data.text || '').split('\n\n').filter(Boolean);

  return (
    <section className="relative overflow-hidden flex flex-col min-h-[calc(82svh-5rem)] pt-14 sm:pt-20 pb-6 sm:pb-8 bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/60 border-b border-neutral-200/60">

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex items-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">

          <div className="lg:col-span-6 space-y-6">
            {data.pillText && (
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#c93838] border border-red-100/80 text-xs font-bold tracking-wide shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#c93838]" />
                <span>{data.pillText}</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 tracking-tight font-serif leading-[1.12]">
              {renderTitle(data.title, data.highlightWord)}
            </h1>

            {paragraphs.length > 0 && (
              <div className="space-y-3.5 text-sm text-neutral-600 leading-relaxed font-sans">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            )}

            {(data.buttonLabel || data.secondaryButtonLabel) && (
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                {data.buttonLabel && primaryHref && (
                  <a
                    href={primaryHref}
                    target={data.buttonUrl ? '_blank' : undefined}
                    rel={data.buttonUrl ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-[#c93838] hover:bg-[#b02e2e] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 duration-150 group"
                  >
                    <span>{data.buttonLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}

                {data.secondaryButtonLabel && secondaryHref && (
                  <a
                    href={secondaryHref}
                    target={data.secondaryButtonUrl ? '_blank' : undefined}
                    rel={data.secondaryButtonUrl ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl text-sm font-bold text-neutral-800 bg-white border border-neutral-200/80 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 duration-150"
                  >
                    <span>{data.secondaryButtonLabel}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {data.photo?.src && (
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xl aspect-[4/3]">
                <div
                  className="absolute inset-0 bg-red-100 -translate-x-7 -translate-y-6 -rotate-6 [clip-path:url(#hero-hex-clip)]"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 shadow-xl bg-neutral-900 overflow-hidden group [clip-path:url(#hero-hex-clip)]">
                  <Image
                    src={data.photo.src}
                    alt={data.photo.caption || ''}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    style={focalCropStyle(data.photo)}
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <svg width="0" height="0" className="absolute">
                <defs>
                  <clipPath id="hero-hex-clip" clipPathUnits="objectBoundingBox">
                    <path d="M0.0203,0.454 L0.1871,0.0748 Q0.22,0 0.285,0 L0.715,0 Q0.78,0 0.8129,0.0748 L0.9798,0.454 Q1,0.5 0.9798,0.546 L0.8129,0.9252 Q0.78,1 0.715,1 L0.285,1 Q0.22,1 0.1871,0.9252 L0.0203,0.546 Q0,0.5 0.0203,0.454 Z" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          )}

        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          // The block sits inside BlockRenderer's ScrollReveal wrapper div, so the next
          // block on the page is that wrapper's sibling, not the <section>'s own sibling.
          const wrapper = e.currentTarget.closest('section')?.parentElement;
          const target = wrapper?.nextElementSibling;
          if (!target) return;
          // scrollIntoView aligns to the very top of the viewport, which tucks the target
          // under the sticky h-20 (5rem) navbar — offset manually instead.
          const targetTop = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: targetTop - 80, behavior: 'smooth' });
        }}
        aria-label="Posunout na další obsah"
        className="relative z-10 mx-auto mt-12 flex items-center justify-center text-neutral-400 hover:text-[#c93838] transition-colors cursor-pointer"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  );
}
