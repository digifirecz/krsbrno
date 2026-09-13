'use client';

import { useEffect, useState } from 'react';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { getPageBlocks } from '@/lib/actions/pages';
import { PAGE_IDS } from '@/lib/blocks/pageRegistry';
import type { BlockInstance } from '@/lib/blocks/types';
import {
  Mail,
  Send,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

export default function ContactSection() {
  const [blocks, setBlocks] = useState<BlockInstance[] | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Běžný dotaz',
    message: '',
  });

  useEffect(() => {
    let active = true;
    getPageBlocks(PAGE_IDS.contact)
      .then((fetched) => {
        if (active) setBlocks(fetched || []);
      })
      .catch(() => {
        if (active) setBlocks([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  if (blocks === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const mainBlocks = blocks.filter((b) => b.type !== 'mapEmbed');
  const mapBlocks = blocks.filter((b) => b.type === 'mapEmbed');

  return (
    <div className="bg-white" id="sec-contact">

      <BlockRenderer blocks={mainBlocks} />

      <BlockRenderer blocks={mapBlocks} />

      {/* EMAIL & NAPIŠTE NÁM FORMULÁŘ */}
      <section className="py-14 sm:py-18 bg-neutral-50/70 border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* Left: Email Section & Photo */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#c93838] text-white flex items-center justify-center shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-neutral-900 font-serif">
                      E-mailové kontakty
                    </h2>
                    <p className="text-xs text-neutral-500 font-sans">
                      Osvědčené kanály pro vaše dotazy
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 font-sans text-xs sm:text-sm pt-1">
                  <li className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5 hover:border-red-200 transition-colors">
                    <a href="mailto:info@krsbrno.cz" className="font-bold text-[#c93838] hover:underline flex items-center space-x-1.5">
                      <span>info@krsbrno.cz</span>
                    </a>
                    <p className="text-neutral-600 text-xs">
                      pro dotazy ohledně víry a sboru
                    </p>
                  </li>

                  <li className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5 hover:border-red-200 transition-colors">
                    <a href="mailto:administrator@krsbrno.cz" className="font-bold text-[#c93838] hover:underline flex items-center space-x-1.5">
                      <span>administrator@krsbrno.cz</span>
                    </a>
                    <p className="text-neutral-600 text-xs">
                      pro požadavky týkající se technických problémů webu nebo odkazů
                    </p>
                  </li>

                  <li className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5 hover:border-red-200 transition-colors">
                    <a href="mailto:konference@krsbrno.cz" className="font-bold text-[#c93838] hover:underline flex items-center space-x-1.5">
                      <span>konference@krsbrno.cz</span>
                    </a>
                    <p className="text-neutral-600 text-xs">
                      pro dotazy ohledně naší konference
                    </p>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right: Message Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-extrabold text-neutral-900 font-serif">Napište nám zprávu</h2>
              </div>
              <p className="text-sm sm:text-base text-neutral-600 mb-6 font-sans">
                Máte dotaz k programu, víře nebo hledáte duchovní rozhovor? Vyplňte formulář a my se vám rádi ozveme.
              </p>

              {formSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-xl font-bold text-emerald-900 font-serif">Děkujeme za vaši zprávu!</h4>
                  <p className="text-sm text-emerald-700 font-sans">
                    Zprávu jsme úspěšně přijali a brzy se vám ozveme na zadaný e-mail.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', topic: 'Běžný dotaz', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                  >
                    Odeslat další zprávu
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Vaše jméno <span className="text-[#c93838]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jan Novák"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        E-mailová adresa <span className="text-[#c93838]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jan.novak@email.cz"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Téma dotazu
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838] bg-white"
                    >
                      <option value="Běžný dotaz">Běžný dotaz / Navštívení</option>
                      <option value="Duchovní rozhovor">Duchovní rozhovor / Modlitba</option>
                      <option value="Knihovna DEN">Knihovna DEN</option>
                      <option value="Podpora sboru">Podpora sboru / Dary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Zpráva <span className="text-[#c93838]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Napište nám váš dotaz nebo vzkaz..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200/80 text-sm focus:outline-none focus:ring-2 focus:ring-[#c93838]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-[#c93838] hover:bg-[#b02e2e] transition-all shadow-md hover:-translate-y-0.5 active:scale-98 duration-150 flex items-center justify-center space-x-2 text-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Odeslat zprávu</span>
                  </button>
                </form>
              )}

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}


