'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';

export interface SearchSelectOption {
  value: string;
  label: string;
}

interface SearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchSelectOption[];
  /** Trigger text when nothing is selected. */
  placeholder?: string;
  /** When set, an explicit "clear" row with this label sits at the top of the list. */
  emptyLabel?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Compact styling for use inside table filter rows. */
  size?: 'md' | 'sm';
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder = 'Vyberte…',
  emptyLabel,
  searchPlaceholder = 'Hledat…',
  disabled = false,
  id,
  className = '',
  size = 'md',
}: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; above: boolean } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value) || null;

  const rows = useMemo(() => {
    const q = norm(query.trim());
    const filtered = q ? options.filter((o) => norm(o.label).includes(q)) : options;
    const out: SearchSelectOption[] = [];
    if (emptyLabel && !q) out.push({ value: '', label: emptyLabel });
    return out.concat(filtered);
  }, [options, query, emptyLabel]);

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    setRect({ left: r.left, top: r.bottom, width: r.width, above: spaceBelow < 280 && r.top > spaceBelow });
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    const onDown = (e: MouseEvent) => {
      const tgt = e.target as Node;
      if (!triggerRef.current?.contains(tgt) && !panelRef.current?.contains(tgt)) setOpen(false);
    };
    const onScrollResize = () => place();
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, rows.length - 1)));
  }, [rows.length]);

  useEffect(() => {
    if (!open) return;
    (listRef.current?.children[activeIndex] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const row = rows[activeIndex];
      if (row) pick(row.value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  const pad = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3.5 py-2.5 text-sm';
  const triggerClass = `w-full ${pad} rounded-lg border bg-white text-left flex items-center justify-between gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#c93838]/30 focus:border-[#c93838] disabled:opacity-60 disabled:cursor-not-allowed ${
    open ? 'border-[#c93838]' : 'border-neutral-200 hover:border-neutral-300'
  } cursor-pointer`;

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={triggerClass}
      >
        <span className={`truncate ${selected ? 'text-neutral-800' : 'text-neutral-400'}`}>
          {selected ? selected.label : emptyLabel && !value ? emptyLabel : placeholder}
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {selected && emptyLabel && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Zrušit výběr"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 rounded text-neutral-300 hover:text-[#c93838]"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400" />
        </span>
      </button>

      {open &&
        rect &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: 'fixed',
              left: rect.left,
              width: rect.width,
              ...(rect.above ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.top + 4 }),
            }}
            className="z-[60] rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-100">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full text-sm bg-transparent focus:outline-none placeholder:text-neutral-400"
              />
            </div>
            <ul ref={listRef} role="listbox" className="max-h-56 overflow-auto py-1">
              {rows.length === 0 && <li className="px-3.5 py-2 text-sm text-neutral-400">Nic nenalezeno</li>}
              {rows.map((row, i) => {
                const isSelected = row.value === value;
                const isActive = i === activeIndex;
                const isClear = emptyLabel !== undefined && row.value === '';
                return (
                  <li
                    key={row.value || '__clear__'}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => pick(row.value)}
                    className={`flex items-center justify-between gap-2 px-3.5 py-2 text-sm cursor-pointer ${
                      isActive ? 'bg-red-50 text-[#c93838]' : 'text-neutral-700'
                    } ${isClear ? 'text-neutral-400' : ''}`}
                  >
                    <span className="truncate">{row.label}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" />}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}
