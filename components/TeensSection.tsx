'use client';

import ImageCard from '@/components/ImageCard';
import { 
  Instagram, 
  Mail, 
  Clock, 
  Compass, 
  Users, 
  TreePine, 
  Calendar, 
  Sparkles,
  MapPin,
  Heart
} from 'lucide-react';

interface TeensSectionProps {
  setActiveTab?: (tab: string) => void;
}

export default function TeensSection({ setActiveTab }: TeensSectionProps) {
  return (
    <div className="bg-white" id="sec-teens">
      
      {/* Hero Header */}
      <section className="py-12 sm:py-16 bg-neutral-50/90 border-b border-neutral-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Compass className="w-6 h-6" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 font-serif tracking-tight leading-tight">
            Dorost – Poutníci
          </h1>

          <p className="text-sm text-neutral-700 font-sans leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
            Parta dospívajících, kteří společně objevují svět, víru v Boha, budují opravdová přátelství a zažívají dobrodružství.
          </p>
        </div>
      </section>

      {/* 1. SETKÁVÁNÍ */}
      <section className="py-14 sm:py-20 bg-white border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="lg:col-span-7 space-y-5 font-sans text-neutral-700 leading-relaxed text-sm sm:text-base">
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#c93838] font-serif tracking-tight">
                Setkávání
              </h2>

              <p className="font-bold text-neutral-900 text-base sm:text-lg">
                Jsme parta mladých lidí ve věku 12-15 let. Společně následujeme Pána Ježíše, který je naším průvodcem na cestě životem. Proto si říkáme Poutníci.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm">
                Setkáváme se jednou za dva týdny, a to buď v sobotu od 10:30 nebo v neděli od 12:00. Na těchto schůzkách společně poznáváme Pána Boha a prohlubujeme vztahy mezi sebou.
              </p>

              <p className="text-neutral-600 text-xs sm:text-sm">
                Kromě toho hrajeme různé hry, dále zpíváme, čteme a studujeme Bibli nebo i spolu vaříme oběd. Někdy podnikáme i akce jako minigolf, bowling, lasergame, zimní bruslení nebo výlety. Máme mezi sebou přátelskou atmosféru.
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center space-x-2.5 p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-[#c93838] font-extrabold text-xs sm:text-sm font-sans">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Setkání jednou za 2 týdny (Sobota 10:30 / Neděle 12:00)</span>
                </div>
              </div>

            </div>

            {/* Right: Photo */}
            <div className="lg:col-span-5">
              <ImageCard
                src="https://picsum.photos/seed/poutnici-circle1/800/600"
                alt="Setkání dorostu Poutníci v kruhu židlí ve sborové místnosti"
                aspectRatio="aspect-[4/3]"
                caption="Společný čas v kruhu při diskuzích a programu"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. POBYTY */}
      <section className="py-14 sm:py-20 bg-neutral-50/80 border-b border-neutral-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left: Photos Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 order-2 lg:order-1">
              <ImageCard
                src="https://picsum.photos/seed/poutnici-outdoor1/600/800"
                alt="Venkovní hry a aktivity na pobytu Poutníků"
                aspectRatio="aspect-[3/4]"
                caption="Hry v přírodě"
              />
              <ImageCard
                src="https://picsum.photos/seed/poutnici-landscape1/600/800"
                alt="Hraní volejbalu na louce v horách"
                aspectRatio="aspect-[3/4]"
                caption="Sport na letním pobytu"
              />
            </div>

            {/* Right: Text Content */}
            <div className="lg:col-span-7 space-y-5 font-sans text-neutral-700 leading-relaxed text-sm sm:text-base order-1 lg:order-2">
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#c93838] font-serif tracking-tight">
                Pobyty
              </h2>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Třikrát do roka pořádáme pobyty, a to vždy o jarních, letních a podzimních prázdninách. I když nemáš možnost přijít na schůzku a jsi z větší dálky, pobyty jsou ideální příležitost se k nám přidat. Každý pobyt máme nějak tematicky zaměřený.
              </p>

              <div className="p-4 rounded-xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
                <p className="font-bold text-neutral-900 text-xs sm:text-sm">
                  Je to skvělá příležitost poznávat více Pána Boha a navazovat nová přátelství. Máme spoustu dobrodružných her ve dne i v noci.
                </p>
              </div>

              <p className="text-neutral-600 text-xs sm:text-sm italic">
                Pořádáme jarní víkendovky, letní pobyty a podzimní víkendovky.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* 3. PŘIDEJ SE & CONTACT */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left: Info & Contact Buttons */}
            <div className="lg:col-span-6 space-y-5 font-sans text-neutral-700">
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#c93838] font-serif tracking-tight">
                Přidej se
              </h2>

              <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                Pokud bys měl zájem přijít nebo se dozvědět více informací, můžeš nás kontaktovat na instagramu nebo na mailu.
              </p>

              {/* Contact Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="mailto:poutnickymail@gmail.com"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold text-xs sm:text-sm font-sans transition-all cursor-pointer shadow-2xs"
                >
                  <Mail className="w-4 h-4 text-[#c93838]" />
                  <span>poutnickymail@gmail.com</span>
                </a>

                <a
                  href="https://instagram.com/poutnici_brno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 font-bold text-xs sm:text-sm font-sans transition-all cursor-pointer shadow-2xs"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>poutnici_brno</span>
                </a>
              </div>

            </div>

            {/* Right: Group photo in snow */}
            <div className="lg:col-span-6">
              <ImageCard
                src="https://picsum.photos/seed/poutnici-snow1/800/600"
                alt="Skupinová fotka Poutníků na zimním pobytu ve sněhu"
                aspectRatio="aspect-[4/3]"
                caption="Zimní pobyt v horách"
              />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
