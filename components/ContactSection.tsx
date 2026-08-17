'use client';

import { useState } from 'react';
import ImageCard from '@/components/ImageCard';
import { 
  MapPin, 
  Mail, 
  Bus, 
  Car, 
  Send, 
  CheckCircle2, 
  Building2, 
  TreePine, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Běžný dotaz',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="bg-white" id="sec-contact">
      
      {/* 1. HERO HEADER */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <MapPin className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            Kontakt
          </h1>

          <p className="text-sm text-neutral-700 leading-relaxed font-sans max-w-2xl sm:max-w-3xl mx-auto">
            Rádi tě poznáme osobně. Ať už máš otázky ohledně víry, chceš se podívat na naše setkání, nebo nám jen napsat, těší nás tvůj zájem. Jsme otevření každému, kdo hledá odpovědi a společenství.
          </p>
        </div>
      </section>

      {/* 2. ADRESA & BUDOVA (Fotky vlevo, text vpravo) */}
      <section className="py-14 sm:py-18 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
            
            {/* Left: Photos Grid */}
            <div className="lg:col-span-5 space-y-4">
              <ImageCard
                src="https://picsum.photos/seed/krsbrno-building1/800/600"
                alt="Sborový dům Křesťanského sboru Brno na Šámalově ulici"
                aspectRatio="aspect-[4/3]"
                caption="Sborový dům na Šámalově 15a"
              />
              <ImageCard
                src="https://picsum.photos/seed/krsbrno-building2/800/600"
                alt="Vnitřní prostory a sborová zahrada"
                aspectRatio="aspect-[4/3]"
                caption="Zázemí a zahrada sboru"
              />
            </div>

            {/* Right: Text Content */}
            <div className="lg:col-span-7 space-y-8 font-sans text-neutral-700 leading-relaxed">
              
              {/* Adresa */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-serif">
                    Adresa
                  </h2>
                </div>

                <div className="text-xs sm:text-sm text-neutral-600 space-y-3 font-sans leading-relaxed">
                  <p>
                    Nacházíme se na adrese <strong className="text-neutral-900 font-bold">Šámalova 15a, Brno - Židenice</strong> (615 00).
                  </p>
                  <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-sky-900 text-xs sm:text-sm font-sans">
                    <Bus className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <span>Dostanete se k nám pomocí tramvaje číslo <strong>6, 8 a 10</strong> (zastávka <strong>Geislerova</strong>) nebo pomocí auta, které můžete zaparkovat v přilehlých ulicích, kde je zóna C.</span>
                  </div>
                </div>
              </div>

              {/* Budova */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-serif">
                    Budova
                  </h2>
                </div>

                <div className="text-xs sm:text-sm text-neutral-600 space-y-3 font-sans leading-relaxed">
                  <p>
                    Vchod je během doby setkávání otevřený (jinak je třeba zazvonit a otevřou vám). Po vstupu se dostanete do dvora, kde se nachází vstup do naší hlavní sborové budovy, která je vybavená hlavním sálem, knihovnou, kuchyní, hlídanou šatnou, záchody a menší místností pro mládež a děti.
                  </p>

                  <p>
                    Hlavní sál se nachází v prvním patře a není bezbariérový; pro tyto případy však lze využít knihovny v přízemí, kde je vše promítáno na televizi.
                  </p>

                  <div className="flex items-start space-x-2.5 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-xs sm:text-sm font-sans">
                    <TreePine className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Za hlavní budovou je zahrada s možností posezení a houpačkou a pískovištěm pro děti. Ta je nejvíce využívána v létě.</span>
                  </div>

                  <div className="p-4 rounded-xl bg-red-50/60 border border-red-100/80 text-neutral-800 text-xs sm:text-sm font-medium font-sans">
                    💡 Pokud jste u nás poprvé, můžete se kohokoliv na cokoliv zeptat a rádi vám na vše odpoví. Pak už se stačí jen posadit do hlavního sálu a nechat se vtáhnout do děje.
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. EMAIL & NAPIŠTE NÁM FORMULÁŘ */}
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
              <p className="text-xs sm:text-sm text-neutral-600 mb-6 font-sans">
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

      {/* 4. MAP SECTION */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div>
            <h3 className="text-xl font-extrabold text-neutral-900 font-serif">
              Mapa – Šámalova 15a, Brno
            </h3>
            <p className="text-xs text-neutral-500 font-sans">
              Snadný příjezd městskou hromadnou dopravou (Geislerova) i autem.
            </p>
          </div>

          <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-neutral-200/90 shadow-2xs relative bg-neutral-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.4124967812!2d16.6372105!3d49.1926612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47129487c6314f3b%3A0xb30424b9101b7a2d!2zxaPDoW1hbG92YSAxNWEsIDYxNSAwMCBCcm5vLcW9aWRlbmljZQ!5e0!3m2!1scs!2scz!4v1700000000000!5m2!1scs!2scz" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Křesťanský sbor Brno na mapě"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}


