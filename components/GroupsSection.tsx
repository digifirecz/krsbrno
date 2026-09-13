'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GROUPS_DATA } from '@/data/churchData';
import { Users, Mail, Instagram, Facebook, Calendar, Clock, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';

interface GroupsSectionProps {
  initialGroupId?: string;
}

export default function GroupsSection({ initialGroupId = 'besidka' }: GroupsSectionProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(initialGroupId);

  const selectedGroup = GROUPS_DATA.find((g) => g.id === selectedGroupId) || GROUPS_DATA[0];

  return (
    <section className="py-16 sm:py-20 bg-neutral-50/60 border-b border-neutral-200/60" id="sec-groups">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center mx-auto shadow-2xs">
            <Users className="w-6 h-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-serif tracking-tight">
            Program pro děti, mládež a čtenáře
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 font-sans leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
            Vytváříme věkově přizpůsobené prostory pro rozvoj víry, přátelství i aktivní odpočinek.
          </p>
        </div>

        {/* Group Tabs Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {GROUPS_DATA.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 flex items-center space-x-2 ${
                selectedGroupId === group.id
                  ? 'bg-[#c93838] text-white shadow-md -translate-y-0.5'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200/80 shadow-xs'
              }`}
            >
              <span>{group.name}</span>
            </button>
          ))}
        </div>

        {/* Group Detail Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 rounded-md bg-red-50 text-[#c93838] text-xs font-bold uppercase tracking-wider border border-red-100">
                  Věk: {selectedGroup.ageRange}
                </span>
                <span className="text-xs font-semibold text-neutral-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{selectedGroup.meetingTime}</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif">
                {selectedGroup.name}
              </h3>
              <p className="text-base font-semibold text-[#c93838] mt-1 font-sans">
                {selectedGroup.subTitle}
              </p>
            </div>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
              {selectedGroup.description}
            </p>

            {/* Highlights List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Co u nás zažijete
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedGroup.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm text-neutral-700 font-sans">
                    <CheckCircle className="w-4 h-4 text-[#c93838] shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts & Socials */}
            <div className="pt-6 border-t border-neutral-100 flex flex-wrap gap-3 items-center">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-2">
                Kontakt:
              </span>
              {selectedGroup.contacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={
                    contact.type === 'email'
                      ? `mailto:${contact.value}`
                      : contact.type === 'instagram'
                      ? `https://instagram.com/${contact.value.replace('@', '')}`
                      : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 text-neutral-800 text-xs font-semibold transition-colors"
                >
                  {contact.type === 'email' && <Mail className="w-3.5 h-3.5 text-[#c93838]" />}
                  {contact.type === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-600" />}
                  {contact.type === 'facebook' && <Facebook className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{contact.value}</span>
                </a>
              ))}
            </div>

          </div>

          {/* Right Image Showcase */}
          <div className="lg:col-span-5 relative bg-neutral-900 min-h-[300px] lg:min-h-full">
            <Image
              src={selectedGroup.image}
              alt={selectedGroup.name}
              fill
              className="object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">KS Brno</span>
                <p className="text-sm font-semibold font-serif">{selectedGroup.name} – {selectedGroup.meetingTime}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

