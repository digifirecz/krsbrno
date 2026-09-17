'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Mail, Share2 } from 'lucide-react';
import { getPathForTab } from '@/lib/routes';
import { PAGE_ID_TO_TAB } from '@/lib/blocks/pageRegistry';
import type { PageNavEntry } from '@/lib/pages';
import type { SiteSettings } from '@/lib/siteSettings';
import type { SocialLink } from '@/lib/socialLinks';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  navConfigEntries: PageNavEntry[];
  socialLinks: SocialLink[];
  siteSettings: SiteSettings;
}

export default function Footer({ setActiveTab, navConfigEntries, socialLinks, siteSettings }: FooterProps) {
  const [gdprOpen, setGdprOpen] = useState(false);
  const navConfig = new Map(navConfigEntries.map((e) => [e.id, e]));
  const footerEntries = [...navConfig.values()].filter((e) => e.showInFooter);
  const logo = siteSettings?.logo;
  const logoAlt = siteSettings?.logoAlt || '';
  const address = siteSettings?.address;
  const email = siteSettings?.email;
  const siteName = siteSettings?.siteName;

  const handleLink = (tab: string, e?: React.MouseEvent) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) {
      return;
    }
    if (e) {
      e.preventDefault();
    }
    setActiveTab(tab);
  };

  return (
    <footer className="bg-neutral-950 text-white pt-14 pb-10 font-sans border-t border-neutral-800/80 relative overflow-hidden">
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c93838] to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Logo & Info Column */}
          <div className="md:col-span-7 space-y-5">
            <a 
              href={getPathForTab('home')}
              className="cursor-pointer inline-block" 
              onClick={(e) => handleLink('home', e)}
              title="Křesťanský sbor Brno - Úvod"
            >
              {logo && (
                <div className="relative h-9 sm:h-11 w-48 sm:w-56">
                  <Image
                    src={logo}
                    alt={logoAlt}
                    fill
                    unoptimized
                    className="object-contain object-left brightness-0 invert hover:opacity-85 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </a>

            {/* Horizontal Organizace Row right under logo */}
            {footerEntries.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-neutral-400 pt-1">
                <span className="font-bold text-neutral-300 uppercase tracking-wider">Organizace:</span>
                {footerEntries.map((item, idx) => {
                  const tab = PAGE_ID_TO_TAB[item.id] || item.id;
                  return (
                    <span key={item.id} className="flex items-center gap-x-2.5">
                      {idx > 0 && <span className="text-neutral-600">·</span>}
                      <a
                        href={getPathForTab(tab)}
                        onClick={(e) => handleLink(tab, e)}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {item.label}
                      </a>
                    </span>
                  );
                })}
              </div>
            )}

            {address && email && (
              <div className="flex items-center space-x-4 text-xs text-neutral-400">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#c93838]" />
                  <span>{address}</span>
                </div>
                <span className="text-neutral-700">·</span>
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#c93838]" />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors underline underline-offset-2">{email}</a>
                </div>
              </div>
            )}
          </div>

          {/* Social Networks Column */}
          {socialLinks.length > 0 && (
            <div className="md:col-span-5 space-y-4 md:text-right">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans">
                Sledujte nás
              </h4>

              <div className="flex items-center md:justify-end space-x-2.5">
                {socialLinks?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-[#c93838] hover:border-[#c93838] flex items-center justify-center transition-all hover:-translate-y-0.5 shadow-2xs overflow-hidden"
                  >
                    {link.icon ? (
                      <Image src={link.icon} alt="" width={18} height={18} className="object-contain" unoptimized referrerPolicy="no-referrer" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </a>
                ))}
              </div>

              <p className="text-xs text-neutral-400 max-w-[220px] md:ml-auto leading-relaxed">
                Aktuality a fotky najdete také i na našich sociálních sítích.
              </p>
            </div>
          )}

        </div>

        {/* Bottom Bar Divider */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          {siteName && <p>{siteName} © {new Date().getFullYear()}</p>}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setGdprOpen(true)}
              className="hover:text-white transition-colors uppercase tracking-wider font-semibold cursor-pointer"
            >
              GDPR
            </button>
          </div>
        </div>

      </div>

      {/* GDPR Modal */}
      {gdprOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setGdprOpen(false)}
        >
          <div
            className="bg-white text-neutral-900 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold font-serif">Ochrana osobních údajů (GDPR)</h3>
              <button onClick={() => setGdprOpen(false)} className="text-neutral-400 hover:text-neutral-700 font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>
            {siteSettings?.gdprText ? (
              <div
                className="text-sm sm:text-base text-neutral-600 space-y-2 leading-relaxed max-h-80 overflow-y-auto font-sans [&_a]:text-[#c93838] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 last:[&_p]:mb-0"
                dangerouslySetInnerHTML={{ __html: siteSettings.gdprText }}
              />
            ) : (
              <p className="text-sm text-neutral-400">Obsah se připravuje</p>
            )}
            <button
              onClick={() => setGdprOpen(false)}
              className="w-full py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
            >
              Rozumím
            </button>
          </div>
        </div>
      )}

    </footer>
  );
}
