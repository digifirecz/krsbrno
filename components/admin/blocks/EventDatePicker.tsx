'use client';

import { useEffect, useState } from 'react';
import { parseSingleDate as parseSingle, parseDateRange as parseRange } from '@/lib/eventDate';
import DatePicker from '@/components/admin/blocks/DatePicker';
import TimePicker from '@/components/admin/blocks/TimePicker';

interface EventDatePickerProps {
  value: string;
  onChange: (dateText: string) => void;
  time?: string;
  onTimeChange?: (timeText: string) => void;
}

// "7. 2. 2026" -> "2026-02-07" (pro <input type="date">).
function toIso(day: number, month: number, year: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function fromIso(iso: string): { day: number; month: number; year: number } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

function formatSingle(iso: string): string {
  const d = fromIso(iso);
  if (!d) return '';
  return `${d.day}. ${d.month}. ${d.year}`;
}

function formatRange(startIso: string, endIso: string): string {
  const start = fromIso(startIso);
  const end = fromIso(endIso);
  if (!start && !end) return '';
  if (!start) return formatSingle(endIso);
  if (!end) return formatSingle(startIso);
  if (start.year === end.year && start.month === end.month) {
    return `${start.day}.–${end.day}. ${start.month}. ${start.year}`;
  }
  if (start.year === end.year) {
    return `${start.day}. ${start.month}. – ${end.day}. ${end.month}. ${start.year}`;
  }
  return `${start.day}. ${start.month}. ${start.year} – ${end.day}. ${end.month}. ${end.year}`;
}

// "18:00–20:00" -> { start: "18:00", end: "20:00" }; "18:00" -> { start: "18:00", end: "" }.
function parseTime(text: string): { start: string; end: string } {
  const [start, end] = text.trim().split('–').map((s) => s.trim());
  return { start: start || '', end: end || '' };
}

function formatTime(start: string, end: string): string {
  if (!start) return '';
  return end ? `${start}–${end}` : start;
}

export default function EventDatePicker({ value, onChange, time, onTimeChange }: EventDatePickerProps) {
  const [mode, setMode] = useState<'single' | 'range'>('single');
  const [startIso, setStartIso] = useState('');
  const [endIso, setEndIso] = useState('');
  const [timeMode, setTimeMode] = useState<'single' | 'range'>('single');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Rozparsuje existující text jen jednou při načtení (další úpravy už jdou přes picker).
  useEffect(() => {
    const range = parseRange(value);
    if (range) {
      setMode('range');
      setStartIso(toIso(range.start.day, range.start.month, range.start.year));
      setEndIso(toIso(range.end.day, range.end.month, range.end.year));
      return;
    }
    const single = parseSingle(value);
    if (single) setStartIso(toIso(single.day, single.month, single.year));
    const t = parseTime(time || '');
    setStartTime(t.start);
    setEndTime(t.end);
    if (t.end) setTimeMode('range');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModeChange = (next: 'single' | 'range') => {
    setMode(next);
    if (next === 'single') {
      onChange(formatSingle(startIso));
    } else {
      // Ať se do rozsahu nikdy nevstupuje s prázdným "Do" — pro start doplní to samé datum.
      const nextEndIso = endIso || startIso;
      setEndIso(nextEndIso);
      onChange(formatRange(startIso, nextEndIso));
      onTimeChange?.(''); // čas dává smysl jen u jednoho dne
    }
  };

  const handleStartChange = (iso: string) => {
    setStartIso(iso);
    if (mode === 'single') {
      onChange(formatSingle(iso));
      return;
    }
    // "Do" nesmí být dřív než nové "Od" — posune se spolu s ním.
    const nextEndIso = endIso && endIso >= iso ? endIso : iso;
    setEndIso(nextEndIso);
    onChange(formatRange(iso, nextEndIso));
  };

  const handleEndChange = (iso: string) => {
    setEndIso(iso);
    onChange(formatRange(startIso, iso));
  };

  const handleTimeModeChange = (next: 'single' | 'range') => {
    setTimeMode(next);
    if (next === 'single') {
      onTimeChange?.(startTime);
    } else {
      // Ať se do rozsahu nikdy nevstupuje s prázdným "Do" — pro start doplní ten samý čas.
      const nextEndTime = endTime || startTime;
      setEndTime(nextEndTime);
      onTimeChange?.(formatTime(startTime, nextEndTime));
    }
  };

  const handleStartTimeChange = (next: string) => {
    setStartTime(next);
    if (timeMode === 'single') {
      onTimeChange?.(next);
      return;
    }
    // "Do" nesmí být dřív než nové "Od" — posune se spolu s ním.
    const nextEndTime = endTime && endTime >= next ? endTime : next;
    setEndTime(nextEndTime);
    onTimeChange?.(formatTime(next, nextEndTime));
  };

  const handleEndTimeChange = (next: string) => {
    setEndTime(next);
    onTimeChange?.(formatTime(startTime, next));
  };


  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="space-y-2">
        <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50">
          <button
            type="button"
            onClick={() => handleModeChange('single')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'single' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Jeden den
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('range')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'range' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Rozsah dní
          </button>
        </div>

        <div className="flex items-center gap-2">
          <DatePicker value={startIso} onChange={handleStartChange} />
          {mode === 'range' && (
            <>
              <span className="text-neutral-400 text-sm">–</span>
              <DatePicker value={endIso} onChange={handleEndChange} />
            </>
          )}
        </div>
      </div>

      {mode === 'single' && onTimeChange && (
        <div className="space-y-2">
          <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50">
            <button
              type="button"
              onClick={() => handleTimeModeChange('single')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                timeMode === 'single' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Jeden čas
            </button>
            <button
              type="button"
              onClick={() => handleTimeModeChange('range')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                timeMode === 'range' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Rozsah času
            </button>
          </div>

          <div className="flex items-center gap-2">
            <TimePicker value={startTime} onChange={handleStartTimeChange} />
            {timeMode === 'range' && (
              <>
                <span className="text-neutral-400 text-sm">–</span>
                <TimePicker value={endTime} onChange={handleEndTimeChange} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
