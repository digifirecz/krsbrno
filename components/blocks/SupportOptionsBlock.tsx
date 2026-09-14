'use client';

import { useState } from 'react';
import SafeImage from '@/components/SafeImage';
import ImageCard from '@/components/ImageCard';
import { getIcon } from '@/lib/blocks/icons';
import { getPathForTab } from '@/lib/routes';
import { Copy, Check, QrCode, ArrowRight, ChevronRight } from 'lucide-react';
import type { SupportOptionsData } from '@/lib/blocks/types';

export default function SupportOptionsBlock({ data }: { data: SupportOptionsData }) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAmount, setQrAmount] = useState('500');
  const [selectedVs, setSelectedVs] = useState(data.financial.variableSymbols[0]?.code || '');

  const FinancialIcon = getIcon(data.financial.icon) || QrCode;
  const InvolvementIcon = getIcon(data.involvement.icon);
  const involvementHref = data.involvement.linkUrl || (data.involvement.linkTarget ? getPathForTab(data.involvement.linkTarget) : undefined);
  const involvementLinkIsExternal = !!data.involvement.linkUrl;

  const copyAccount = () => {
    navigator.clipboard.writeText(data.financial.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const qrString = `SPD*1.0*ACC:${data.financial.iban}*AM:${qrAmount}.00*CC:CZK*VS:${selectedVs}*MSG:Dar`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrString)}`;

  return (
    <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {(data.heading || data.description) && (
          <div className="text-center max-w-3xl mx-auto space-y-3">
            {getIcon(data.icon) && (() => {
              const HeadingIcon = getIcon(data.icon)!;
              return (
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-2xs">
                  <HeadingIcon className="w-5 h-5" />
                </div>
              );
            })()}
            {data.heading && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
                {data.heading}
              </h2>
            )}
            {data.description && (
              <p className="text-sm sm:text-base text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                {data.description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          {/* Financial card */}
          <div className="bg-neutral-50/80 p-7 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-[#c93838] text-white flex items-center justify-center shadow-xs">
                <FinancialIcon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-extrabold text-neutral-900 font-serif">
                {data.financial.title}
              </h3>
            </div>

            {(data.financial.text || data.financial.highlight) && (
              <div className="space-y-3 font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {data.financial.text && <p className="whitespace-pre-line">{data.financial.text}</p>}
                {data.financial.highlight && (
                  <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-100 text-neutral-900 text-xs sm:text-sm font-sans whitespace-pre-line">
                    {data.financial.highlight}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 font-sans pt-2">
              <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  {data.financial.bankName && (
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{data.financial.bankName}</span>
                  )}
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#c93838] hover:underline cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Platba</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#c93838] font-mono tracking-tight">
                    {data.financial.accountNumber}
                  </span>
                  <button
                    onClick={copyAccount}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all cursor-pointer border border-neutral-200"
                  >
                    {copiedAccount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAccount ? 'Zkopírováno' : 'Zkopírovat'}</span>
                  </button>
                </div>
              </div>

              {data.financial.variableSymbols.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-neutral-700 block">
                    Lze uvést konkrétní účel daru pomocí variabilního symbolu:
                  </span>
                  <ul className="space-y-2 text-xs font-sans">
                    {data.financial.variableSymbols.map((vs, idx) => {
                      const vsHref = vs.linkUrl || (vs.linkTarget ? getPathForTab(vs.linkTarget) : undefined);
                      const vsLinkIsExternal = !!vs.linkUrl;
                      return (
                        <li key={idx} className="flex items-center flex-wrap gap-x-2.5 gap-y-1 p-2.5 bg-white rounded-xl border border-neutral-200/80">
                          <span className="font-mono font-extrabold text-[#c93838] px-2 py-0.5 rounded bg-red-50 border border-red-100">{vs.code}</span>
                          <span className="font-bold text-neutral-800">{vs.label}</span>
                          {vs.linkLabel && vsHref && (
                            <a
                              href={vsHref}
                              target={vsLinkIsExternal ? '_blank' : undefined}
                              rel={vsLinkIsExternal ? 'noopener noreferrer' : undefined}
                              className="inline-flex items-center space-x-0.5 ml-auto text-[#c93838] font-bold hover:underline cursor-pointer"
                            >
                              <span>{vs.linkLabel}</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Involvement card */}
          <div className="bg-neutral-50/80 p-7 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-6">
            <div className="flex items-center space-x-3">
              {InvolvementIcon && (
                <div className="w-11 h-11 rounded-xl bg-[#c93838] text-white flex items-center justify-center shadow-xs">
                  <InvolvementIcon className="w-5 h-5" />
                </div>
              )}
              <h3 className="text-2xl font-extrabold text-neutral-900 font-serif">
                {data.involvement.title}
              </h3>
            </div>

            {data.involvement.text && (
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans whitespace-pre-line">
                {data.involvement.text}
              </p>
            )}

            {data.involvement.linkLabel && involvementHref && (
              <a
                href={involvementHref}
                target={involvementLinkIsExternal ? '_blank' : undefined}
                rel={involvementLinkIsExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-[#c93838] hover:underline cursor-pointer"
              >
                <span>{data.involvement.linkLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}

            {data.involvement.photo?.src && (
              <div className="pt-2">
                <ImageCard
                  src={data.involvement.photo.src}
                  alt={data.involvement.photo.caption || ''}
                  aspectRatio="aspect-[16/10]"
                  caption={data.involvement.photo.caption}
                  focalX={data.involvement.photo.focalX}
                  focalY={data.involvement.photo.focalY}
                  zoom={data.involvement.photo.zoom}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-[#c93838]" />
                <h3 className="text-xl font-bold text-neutral-900 font-serif">QR Platba</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-neutral-400 hover:text-neutral-700 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Částka (CZK):</label>
                <input
                  type="number"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-[#c93838]"
                />
              </div>

              {data.financial.variableSymbols.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Variabilní symbol:</label>
                  <select
                    value={selectedVs}
                    onChange={(e) => setSelectedVs(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-900 bg-white focus:ring-2 focus:ring-[#c93838]"
                  >
                    {data.financial.variableSymbols.map((vs, idx) => (
                      <option key={idx} value={vs.code}>{vs.code} – {vs.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="p-4 bg-neutral-100 rounded-xl flex flex-col items-center justify-center">
                <SafeImage
                  src={qrImageUrl}
                  alt="QR Platba"
                  width={200}
                  height={200}
                  unoptimized
                  className="w-48 h-48 rounded-xl border border-neutral-200 bg-white p-2 object-contain shadow-xs"
                />
                <span className="text-xs text-neutral-500 mt-2 font-medium">
                  Naskenujte v mobilním bankovnictví
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-xl bg-[#c93838] text-white font-bold text-sm hover:bg-[#b02e2e] transition-colors shadow-xs font-sans cursor-pointer"
            >
              Zavřít
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
