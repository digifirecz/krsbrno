'use client';

import { useState } from 'react';
import { Sparkles, Send, X, Bot, User, Loader2 } from 'lucide-react';

interface AskAiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AskAiModal({ isOpen, onClose }: AskAiModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Dobrý den! Jsem AI asistent Křesťanského sboru Brno. Rád vám odpovím na jakékoliv dotazy o bohoslužbách, mládeži, programu pro děti nebo kontakt do sboru. Na co se chcete zeptat?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    'Kdy je nedělní bohoslužba?',
    'Jak funguje program pro děti (Besídka)?',
    'Kdy se schází mládež Elevate?',
    'Kde zaparkovat u sboru?',
    'Číslo účtu pro dary',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Děkujeme za dotaz!' },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Náš sbor se schází každou neděli od 9:30 na Šámalově 15a v Brně-Židenicích. Těšíme se na vás!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl h-[580px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-red-600 text-white shadow-sm">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AI Průvodce sboru</h3>
              <p className="text-xs text-neutral-400">Ptejte se na program, informace a víru</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-neutral-50/50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 text-red-600">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-red-600 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-bl-none shadow-2xs'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 text-white">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-neutral-500 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
              <span>AI asistent přemýšlí...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 px-4 bg-white border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[10px] font-bold uppercase text-neutral-400 shrink-0">Tipy:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 whitespace-nowrap text-xs font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Napište dotaz..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-red-600 text-white disabled:opacity-50 hover:bg-red-700 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
