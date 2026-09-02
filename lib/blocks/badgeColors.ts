export const BADGE_COLORS = {
  red: { label: 'Červená', bg: 'bg-red-100/80', text: 'text-[#c93838]', swatch: '#c93838' },
  blue: { label: 'Modrá', bg: 'bg-blue-100/80', text: 'text-blue-700', swatch: '#1d4ed8' },
  green: { label: 'Zelená', bg: 'bg-emerald-100/80', text: 'text-emerald-700', swatch: '#047857' },
  amber: { label: 'Žlutá', bg: 'bg-amber-100/80', text: 'text-amber-700', swatch: '#b45309' },
  purple: { label: 'Fialová', bg: 'bg-purple-100/80', text: 'text-purple-700', swatch: '#7e22ce' },
  gray: { label: 'Šedá', bg: 'bg-neutral-200/80', text: 'text-neutral-700', swatch: '#404040' },
} as const;

export type BadgeColor = keyof typeof BADGE_COLORS;

export const BADGE_COLOR_NAMES = Object.keys(BADGE_COLORS) as BadgeColor[];

// 'red' is the color the badge always used before this was configurable, so
// it stays the default whenever a card doesn't specify one.
export function getBadgeColorClasses(color?: string): { bg: string; text: string } {
  const key = (color && color in BADGE_COLORS ? color : 'red') as BadgeColor;
  const { bg, text } = BADGE_COLORS[key];
  return { bg, text };
}
