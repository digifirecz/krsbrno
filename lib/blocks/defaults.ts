import type { BlockType, BlockData } from '@/lib/blocks/types';

export function emptyBlockData(type: BlockType): BlockData {
  if (type === 'pageHero') return { title: '' };
  if (type === 'homeHero') return { title: '' };
  if (type === 'quote') return { quote: '' };
  if (type === 'ctaBlock') return { title: '' };
  if (type === 'timeline') return { items: [{ year: '', title: '' }] };
  if (type === 'infoCard') return { title: '' };
  if (type === 'photoCardGrid') return { cards: [{ title: '' }] };
  if (type === 'scheduleCard') return { schedule: [{ label: '', time: '' }] };
  if (type === 'checklistCard') return { items: [{ title: '' }] };
  if (type === 'listCard') return { items: [{ title: '' }] };
  if (type === 'cardGrid') return { cards: [{ kind: 'icon', title: '' }] };
  if (type === 'badgeCard') return { badges: [] };
  if (type === 'textSections') return { sections: [{ heading: '' }] };
  if (type === 'mapEmbed') return { embedUrl: '' };
  if (type === 'tagGroups') return { groups: [{ heading: '', tags: [''] }] };
  if (type === 'supportOptions') {
    return {
      financial: { title: '', accountNumber: '', iban: '', variableSymbols: [] },
      involvement: { title: '' },
    };
  }
  if (type === 'socialCard') return { links: [] };
  if (type === 'peopleList') return { people: [''] };
  if (type === 'articlesBlock') return { heading: 'Události' };
  return { cards: [{ title: '' }] };
}
