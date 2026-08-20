export interface ManageablePage {
  id: string;
  label: string;
  protected?: boolean;
}

// Stable Firestore document keys for the built-in pages — plain numbers, decoupled from
// both the page's editable title and the semantic route/tab name used in ChurchApp/routes.
export const PAGE_IDS = {
  beliefs: '1',
  about: '2',
  meetings: '3',
  library: '4',
  contact: '5',
  support: '6',
  youth: '7',
  teens: '8',
  management: '9',
  leadership: '10',
  confession: '11',
} as const;

// Reverse of PAGE_IDS: numeric Firestore doc id -> semantic tab name, so URL
// resolution can hand ChurchApp the tab name its switch-case actually matches on.
export const PAGE_ID_TO_TAB: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_IDS).map(([tab, id]) => [id, tab])
);

export const MANAGEABLE_PAGES: ManageablePage[] = [
  { id: PAGE_IDS.beliefs, label: 'Čemu věříme' },
  { id: PAGE_IDS.about, label: 'O našem sboru' },
  { id: PAGE_IDS.meetings, label: 'Společná setkávání' },
  { id: PAGE_IDS.library, label: 'Knihovna DEN' },
  { id: PAGE_IDS.contact, label: 'Kontakt' },
  { id: PAGE_IDS.support, label: 'Podpora' },
  { id: PAGE_IDS.youth, label: 'Mládež Elevate' },
  { id: PAGE_IDS.teens, label: 'Dorost Poutníci' },
  { id: PAGE_IDS.management, label: 'Kdo spravuje sbor' },
  { id: PAGE_IDS.leadership, label: 'Kdo nás vede' },
  { id: PAGE_IDS.confession, label: 'Naše vyznání' },
];
