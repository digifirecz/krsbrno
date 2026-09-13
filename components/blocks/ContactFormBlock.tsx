'use client';

import { useState } from 'react';
import { createContactMessage } from '@/lib/actions/contactMessages';
import { Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import type { ContactFormBlockData } from '@/lib/blocks/types';

export default function ContactFormBlock({ data }: { data: ContactFormBlockData }) {
  const topics = data.topics && data.topics.length > 0 ? data.topics : ['Běžný dotaz'];
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: topics[0],
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      await createContactMessage(formData);
      setFormSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-14 sm:py-18 bg-neutral-50/70 border-b border-neutral-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">

          {/* Left: Email Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#c93838] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-neutral-900 font-serif">
                    {data.emailsHeading || 'E-mailové kontakty'}
                  </h2>
                  {data.emailsSubheading && (
                    <p className="text-sm sm:text-base text-neutral-500 font-sans">
                      {data.emailsSubheading}
                    </p>
                  )}
                </div>
              </div>

              {data.contacts.length > 0 && (
                <ul className="space-y-3 font-sans pt-1">
                  {data.contacts.map((contact, idx) => (
                    <li key={idx} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5 hover:border-red-200 transition-colors">
                      <a href={`mailto:${contact.email}`} className="font-bold text-[#c93838] hover:underline flex items-center space-x-1.5 text-sm sm:text-base">
                        <span>{contact.email}</span>
                      </a>
                      {contact.description && (
                        <p className="text-neutral-600 text-xs">
                          {contact.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-2xs">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#c93838] flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900 font-serif">{data.formHeading || 'Napište nám zprávu'}</h2>
                {data.formText && (
                  <p className="text-sm sm:text-base text-neutral-600 font-sans">
                    {data.formText}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-neutral-100 mb-6" />

            {formSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in duration-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-bold text-emerald-900 font-serif">Děkujeme za vaši zprávu!</h4>
                <p className="text-sm sm:text-base text-emerald-700 font-sans">
                  Zprávu jsme úspěšně přijali a brzy se vám ozveme na zadaný e-mail.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', topic: topics[0], message: '' });
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
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
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

                {submitError && (
                  <p className="text-xs font-semibold text-[#c93838]">
                    Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-[#c93838] hover:bg-[#b02e2e] transition-all shadow-md hover:-translate-y-0.5 active:scale-98 duration-150 flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Odesílám…' : 'Odeslat zprávu'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
