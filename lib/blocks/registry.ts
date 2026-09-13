import type { BlockType } from '@/lib/blocks/types';

export interface BlockTypeInfo {
  type: BlockType;
  label: string;
  description: string;
}

export const BLOCK_TYPE_REGISTRY: BlockTypeInfo[] = [
  { type: 'pageHero', label: 'Úvodní blok', description: 'Ikona, titulek, popis, zvýrazněný dodatek a fotky.' },
  { type: 'homeHero', label: 'Velký hero (Úvod)', description: 'Nadpis se zvýrazněným slovem, text, dvě tlačítka a velká fotka vedle sebe — pro hlavní stránku.' },
  { type: 'iconGrid', label: 'Mřížka karet', description: 'Nadpis, podnadpis a karty s ikonou, titulkem a textem nebo odrážkovým seznamem.' },
  { type: 'quote', label: 'Citace', description: 'Citát nebo verš s podtextem (autor, zdroj).' },
  { type: 'ctaBlock', label: 'Výzva k akci', description: 'Titulek, text, tlačítko s odkazem a volitelně fotky.' },
  { type: 'timeline', label: 'Časová osa', description: 'Nadpis a rozklikávací seznam let s titulkem a textem.' },
  { type: 'infoCard', label: 'Informační karta', description: 'Štítek, titulek, text, adresa a fotka vedle sebe.' },
  { type: 'photoCardGrid', label: 'Mřížka karet s fotkou', description: 'Karty s fotkou nahoře, štítkem, titulkem, textem a volitelným odkazem.' },
  { type: 'scheduleCard', label: 'Karta s otevírací dobou', description: 'Fotka, seznam dnů/časů a doprovodný text.' },
  { type: 'checklistCard', label: 'Seznam se zaškrtnutím', description: 'Větší blok: eyebrow, nadpis, seznam bodů se zaškrtávací ikonou, poznámka a volitelně fotka vedle.' },
  { type: 'listCard', label: 'Kompaktní karta se seznamem', description: 'Malá karta s ikonou, nadpisem, podnadpisem a odrážkovým seznamem bodů.' },
  { type: 'cardGrid', label: 'Smíšená mřížka karet', description: 'Mřížka 2×2 kombinující karty typu ikona+text, seznam nebo jména vedle sebe.' },
  { type: 'badgeCard', label: 'Karta se štítky', description: 'Ikona, nadpis, podnadpis, řádek štítků a text.' },
  { type: 'textSections', label: 'Textové sekce', description: 'Více textových bloků s nadpisem, odstavci a poznámkami, vedle fotek.' },
  { type: 'mapEmbed', label: 'Vložený obsah', description: 'Libovolný iframe embed (URL) s nadpisem.' },
  { type: 'tagGroups', label: 'Skupiny štítků', description: 'Skupiny s nadpisem a seznamem krátkých štítků.' },
  { type: 'supportOptions', label: 'Karta s platebními údaji', description: 'Karta s bankovním účtem a QR platbou vedle karty s popisem.' },
  { type: 'socialCard', label: 'Text s odkazy', description: 'Nadpis, text a odkazy, volitelně s fotkou nebo vloženým obsahem vedle.' },
  { type: 'peopleList', label: 'Seznam osob', description: 'Ikona, nadpis a mřížka jmen s iniciálami v kolečku.' },
  { type: 'articlesBlock', label: 'Seznam článků', description: 'Ikona, nadpis a popis; karty se sem načtou automaticky ze Článků v administraci.' },
  { type: 'sermonsBlock', label: 'Seznam kázání', description: 'Vyhledávání, filtrování podle kategorie a přehrávač — kázání se sem načtou automaticky ze sekce Kázání v administraci.' },
];

export function getBlockTypeLabel(type: BlockType): string {
  return BLOCK_TYPE_REGISTRY.find((b) => b.type === type)?.label || type;
}
