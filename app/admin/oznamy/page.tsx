'use client';

import { useEffect, useMemo, useState } from 'react';
import RequireAuth from '@/components/admin/RequireAuth';
import ConfirmModal from '@/components/admin/blocks/ConfirmModal';
import { useToast } from '@/components/admin/ToastProvider';
import { getContactMessages, markContactMessageRead, deleteContactMessage } from '@/lib/actions/contactMessages';
import type { ContactMessage } from '@/lib/contactMessages';
import { MessageSquare, Trash2, Mail, MailOpen, ChevronDown } from 'lucide-react';

function fmtDate(v: Date | null | undefined): string {
  if (!v) return '';
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminMessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  useEffect(() => {
    getContactMessages()
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);
  const shown = onlyUnread ? messages.filter((m) => !m.read) : messages;

  const toggleExpand = async (msg: ContactMessage) => {
    const opening = expandedId !== msg.id;
    setExpandedId(opening ? msg.id : null);
    if (opening && !msg.read) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
      try {
        await markContactMessageRead(msg.id, true);
      } catch {
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: false } : m)));
      }
    }
  };

  const toggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRead = !msg.read;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: nextRead } : m)));
    try {
      await markContactMessageRead(msg.id, nextRead);
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: !nextRead } : m)));
      showToast('Nepodařilo se změnit stav zprávy.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast('Zpráva byla smazána.');
    } catch (err) {
      showToast(`Zprávu se nepodařilo smazat${err instanceof Error ? `: ${err.message}` : '.'}`, 'error');
    }
  };

  return (
    <RequireAuth>
      {() => (
        <div className="max-w-3xl">
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-[#c93838] border border-red-100/90 flex items-center justify-center shrink-0 shadow-2xs">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-serif">Oznamy</h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Zprávy odeslané přes formulář na stránce Kontakt.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOnlyUnread((v) => !v)}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                onlyUnread ? 'bg-[#c93838] text-white border-[#c93838]' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Jen nepřečtené{unreadCount > 0 ? ` (${unreadCount})` : ''}</span>
            </button>
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <div className="w-8 h-8 border-4 border-[#c93838] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : shown.length === 0 ? (
            <p className="text-sm text-neutral-400 px-1">
              {onlyUnread ? 'Žádné nepřečtené zprávy.' : 'Zatím žádné zprávy.'}
            </p>
          ) : (
            <div className="space-y-2.5">
              {shown.map((msg) => {
                const expanded = expandedId === msg.id;
                return (
                  <div
                    key={msg.id}
                    className={`rounded-2xl border transition-colors ${msg.read ? 'border-neutral-200 bg-white' : 'border-red-200 bg-red-50/30'}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleExpand(msg)}
                      className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${msg.read ? 'bg-neutral-100 text-neutral-400' : 'bg-[#c93838] text-white'}`}>
                        {msg.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm ${msg.read ? 'font-semibold text-neutral-800' : 'font-bold text-neutral-900'}`}>{msg.name}</span>
                          {msg.topic && (
                            <span className="text-xs font-semibold text-[#c93838] bg-red-50 px-2 py-0.5 rounded-full">{msg.topic}</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 truncate">{msg.email} · {fmtDate(msg.createdAt)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleRead(msg, e)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer shrink-0"
                        title={msg.read ? 'Označit jako nepřečtené' : 'Označit jako přečtené'}
                      >
                        {msg.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(msg);
                        }}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-[#c93838] hover:bg-red-50 cursor-pointer shrink-0"
                        title="Smazat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                    {expanded && (
                      <div className="px-4 pb-4 pl-16">
                        <p className="text-sm text-neutral-700 whitespace-pre-line bg-neutral-50 border border-neutral-200/70 rounded-xl p-3.5">
                          {msg.message}
                        </p>
                        <a
                          href={`mailto:${msg.email}`}
                          className="inline-flex items-center space-x-1.5 mt-2 text-xs font-bold text-[#c93838] hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Odpovědět na {msg.email}</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <ConfirmModal
            open={deleteTarget !== null}
            title="Smazat zprávu"
            message="Opravdu chcete tuto zprávu trvale smazat?"
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        </div>
      )}
    </RequireAuth>
  );
}
