// Parsing helpers for the free-text `dateText` articles store (e.g. "7. 2. 2026"
// or "3.–5. 7. 2026"). Shared between the admin date picker (EventDatePicker)
// and public sorting (EventsSection) so both agree on the same formats.

export type DMY = { day: number; month: number; year: number };

// "7. 2. 2026" -> { day: 7, month: 2, year: 2026 }, jinak null.
export function parseSingleDate(text: string): DMY | null {
  const m = text.trim().match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
  if (!m) return null;
  return { day: Number(m[1]), month: Number(m[2]), year: Number(m[3]) };
}

// Rozpozná všechny 3 tvary rozsahu dat (stejný měsíc/rok, stejný rok, nebo
// úplně jiná data), jinak null.
export function parseDateRange(text: string): { start: DMY; end: DMY } | null {
  const t = text.trim();
  let m = t.match(/^(\d{1,2})\.–(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
  if (m) {
    const [, d1, d2, mo, y] = m.map(Number);
    return { start: { day: d1, month: mo, year: y }, end: { day: d2, month: mo, year: y } };
  }
  m = t.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*–\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
  if (m) {
    const [, d1, mo1, d2, mo2, y] = m.map(Number);
    return { start: { day: d1, month: mo1, year: y }, end: { day: d2, month: mo2, year: y } };
  }
  m = t.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})\s*–\s*(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
  if (m) {
    const [, d1, mo1, y1, d2, mo2, y2] = m.map(Number);
    return { start: { day: d1, month: mo1, year: y1 }, end: { day: d2, month: mo2, year: y2 } };
  }
  return null;
}

// Datum pro řazení (start rozsahu, nebo jediné datum), nebo null když se
// dateText nedá rozpoznat (např. prázdné nebo ručně napsaný jiný tvar).
export function eventDateSortKey(dateText: string): Date | null {
  const range = parseDateRange(dateText);
  const dmy = range ? range.start : parseSingleDate(dateText);
  if (!dmy) return null;
  return new Date(dmy.year, dmy.month - 1, dmy.day);
}
