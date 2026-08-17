'use client';

import { useState } from 'react';
import ImageCard from '@/components/ImageCard';
import QuoteBanner from '@/components/QuoteBanner';
import Image from 'next/image';
import { 
  Heart, 
  Copy, 
  Check, 
  QrCode, 
  Sparkles, 
  Building2, 
  Coins, 
  HandHeart, 
  ShieldCheck, 
  ExternalLink,
  BookOpen,
  Users,
  CheckCircle2,
  Wallet
} from 'lucide-react';

export default function SupportSection() {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAmount, setQrAmount] = useState('500');
  const [selectedVs, setSelectedVs] = useState('0009');

  const accountNumber = "2500752953/2010";
  const iban = "CZ5120100000002500752953";

  const copyToClipboard = (text: string, type: 'account' | 'iban') => {
    navigator.clipboard.writeText(text);
    if (type === 'account') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2000);
    }
  };

  const qrString = `SPD*1.0*ACC:${iban}*AM:${qrAmount}.00*CC:CZK*VS:${selectedVs}*MSG:Dar pro KS Brno`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrString)}`;

  return (
    <div className="bg-white" id="sec-support">
      
      {/* 1. HERO HEADER */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Heart className="w-6 h-6 fill-[#c93838]/20" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            Podpora
          </h1>

          <p className="text-sm text-neutral-700 leading-relaxed font-sans max-w-2xl sm:max-w-3xl mx-auto">
            Naše činnost je založena na dobrovolné podpoře lidí, kterým záleží na tom, co děláme. Věříme, že dávání má vycházet ze svobodného rozhodnutí a vděčnosti, nikoli z povinnosti. Proto je finanční podpora vždy dobrovolná a transparentní.
          </p>

          <div className="bg-red-50/80 border border-red-100/90 rounded-xl px-5 py-3 text-sm text-neutral-700 font-sans shadow-2xs max-w-2xl mx-auto">
            Již od vzniku sboru jsme se rozhodli nepřijímat finanční podporu od státu, protože chceme být nezávislým společenstvím, které stojí na víře a ochotě lidí podporovat Boží dílo.
          </div>
        </div>
      </section>

      {/* 2. ZPŮSOBY PODPORY */}
      <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-2xs">
              <HandHeart className="w-5 h-5" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Způsoby podpory
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            
            {/* Left: Finanční podpora */}
            <div className="bg-neutral-50/80 p-7 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-6">
              
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-[#c93838] text-white flex items-center justify-center shadow-xs">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-neutral-900 font-serif">
                    Finanční podpora
                  </h3>
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <p>
                  Je to způsob, jak se každý může podílet na tom, co jako sbor děláme. Díky darům můžeme organizovat setkání, pracovat s dětmi a mládeží a naplno sloužit lidem kolem nás.
                </p>

                <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-100 text-neutral-900 font-bold text-xs sm:text-sm font-sans">
                  Pokud se rozhodneš naši službu podpořit, děkujeme. Velmi si toho vážíme.
                </div>
              </div>

              <div className="space-y-4 font-sans pt-2">

                {/* Big Account Card */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fio banka, a.s.</span>
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
                      {accountNumber}
                    </span>

                    <button
                      onClick={() => copyToClipboard(accountNumber, 'account')}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all cursor-pointer border border-neutral-200"
                    >
                      {copiedAccount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedAccount ? 'Zkopírováno' : 'Zkopírovat'}</span>
                    </button>
                  </div>
                </div>

                {/* Variable Symbols */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-neutral-700 block">
                    Lze uvést konkrétní účel daru pomocí variabilního symbolu:
                  </span>

                  <ul className="space-y-2 text-xs font-sans">
                    <li className="flex items-center space-x-2.5 p-2.5 bg-white rounded-xl border border-neutral-200/80">
                      <span className="font-mono font-extrabold text-[#c93838] px-2 py-0.5 rounded bg-red-50 border border-red-100">0009</span>
                      <span className="font-bold text-neutral-800">Dar obecný</span>
                    </li>
                    <li className="flex items-center space-x-2.5 p-2.5 bg-white rounded-xl border border-neutral-200/80">
                      <span className="font-mono font-extrabold text-[#c93838] px-2 py-0.5 rounded bg-red-50 border border-red-100">1970</span>
                      <span className="font-bold text-neutral-800">Matěj a Kristína Noví</span>
                    </li>
                    <li className="flex items-center space-x-2.5 p-2.5 bg-white rounded-xl border border-neutral-200/80">
                      <span className="font-mono font-extrabold text-[#c93838] px-2 py-0.5 rounded bg-red-50 border border-red-100">3915</span>
                      <span className="font-bold text-neutral-800">Budova Šámalova</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

            {/* Right: Podpora službou */}
            <div className="bg-neutral-50/80 p-7 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-6">
              
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-[#c93838] text-white flex items-center justify-center shadow-xs">
                  <HandHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-neutral-900 font-serif">
                    Podpora zapojením
                  </h3>
                </div>
              </div>

              <div className="space-y-3 font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
                <p>
                  Sbor stojí také na ochotě lidí zapojit se svým časem a dary. Možností je mnoho – od hudební služby, technického zajištění, vyučování Bible až po praktickou pomoc a drobné (ale důležité) úkoly v zákulisí. Každá služba má své místo a smysl.
                </p>

                <p>
                  Zapojení do služby je určeno pro ty, kdo přijali víru v Ježíše Krista a chtějí svou víru žít aktivně a zodpovědně. Služba není povinností, ale vyjádřením víry a ochoty pomáhat druhým.
                </p>
              </div>

              {/* Photo */}
              <div className="pt-2">
                <ImageCard
                  src="https://picsum.photos/seed/krsbrno-service/800/600"
                  alt="Hudební služba a společné setkání v sále"
                  aspectRatio="aspect-[16/10]"
                  caption="Společná hudební služba a zapojení dobrovolníků v sále"
                />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. BIBLE VERSE BANNER */}
      <QuoteBanner 
        quote="„Říkám vám, že kdo skoupě rozséva, bude skoupě sklízet, ale kdo rozséva štědře, bude sklízet štědře. Každý ať dává, jak se v srdci rozhodl, ne s lítostí anebo z povinnosti. Vždyť Bůh miluje ochotného dárce.“"
        citation="2 Korintským 9:6-7 (Bible)"
      />

      {/* 4. VYUŽITÍ FINANČNÍ PODPORY */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] border border-red-100 flex items-center justify-center mx-auto shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">
              Využití finanční podpory
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed max-w-2xl mx-auto">
              S finančními prostředky zacházíme pečlivě a s vědomím odpovědnosti. Záleží nám na tom, aby každý dar byl využit smysluplně a přinášel skutečný užitek.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chod sboru */}
            <div className="bg-neutral-50/80 p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-5">
              <h3 className="text-xl font-extrabold text-neutral-900 font-serif text-center pb-1 border-b border-neutral-200/80">
                Chod sboru
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                {/* Column 1 */}
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Náhrady (cestovné)
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Režijní náklady
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Drobný majetek
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Budova - provoz
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Obědy, občerstvení, balíčky
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Besídka, poutníci, mládež
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Evangelizace a misie
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Příspěvky KFS
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Pojištění
                  </div>
                </div>
              </div>
            </div>

            {/* Evangelizace a misie */}
            <div className="bg-neutral-50/80 p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-2xs space-y-5">
              <h3 className="text-xl font-extrabold text-neutral-900 font-serif text-center pb-1 border-b border-neutral-200/80">
                Evangelizace a misie
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans text-xs">
                {/* Column 1 */}
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    TWR
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Knihovna DEN
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Lavina
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Spolek SKP
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    Marek Hančík
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    HledamBoha.cz
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    BTM
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/80 text-center font-bold text-neutral-800 shadow-2xs">
                    věznice aj.
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-[#c93838]" />
                <h3 className="text-xl font-bold text-neutral-900 font-serif">QR Platba – KS Brno</h3>
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
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                  Částka (CZK):
                </label>
                <input
                  type="number"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-[#c93838]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                  Variabilní symbol:
                </label>
                <select
                  value={selectedVs}
                  onChange={(e) => setSelectedVs(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-900 bg-white focus:ring-2 focus:ring-[#c93838]"
                >
                  <option value="0009">0009 – Dar obecný</option>
                  <option value="1970">1970 – Matěj a Kristína Noví</option>
                  <option value="3915">3915 – Budova Šámalova</option>
                </select>
              </div>

              <div className="p-4 bg-neutral-100 rounded-xl flex flex-col items-center justify-center">
                <Image
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

    </div>
  );
}



