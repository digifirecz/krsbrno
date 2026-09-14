export type BlockType = 'pageHero' | 'homeHero' | 'iconGrid' | 'quote' | 'ctaBlock' | 'timeline' | 'infoCard' | 'photoCardGrid' | 'scheduleCard' | 'checklistCard' | 'listCard' | 'cardGrid' | 'badgeCard' | 'textSections' | 'mapEmbed' | 'tagGroups' | 'supportOptions' | 'socialCard' | 'peopleList' | 'articlesBlock' | 'sermonsBlock' | 'contactFormBlock';

export interface BlockPhoto {
  src: string;
  caption?: string;
  // Where the photo should be framed when it's cropped to fit a fixed shape
  // on the frontend (object-position, as a 0-100 percentage). The uploaded
  // photo itself is never cropped — only its on-screen framing changes.
  // Undefined means "center" (the CSS/browser default).
  focalX?: number;
  focalY?: number;
  // Extra zoom (>=1) applied around the focal point, cropping further into
  // the axis that would otherwise show the full, uncropped photo. 1 or
  // undefined means "no extra zoom" — identical to the previous behavior.
  zoom?: number;
}

export interface PageHeroData {
  icon?: string;
  title: string;
  description?: string;
  highlight?: string;
  photos?: BlockPhoto[];
}

export interface IconGridCard {
  icon?: string;
  title: string;
  text?: string;
  items?: ChecklistItem[];
  photo?: BlockPhoto;
}

export interface IconGridData {
  heading?: string;
  subheading?: string;
  cards: IconGridCard[];
  // Optional photo gallery shown below the cards.
  photos?: BlockPhoto[];
}

export interface QuoteData {
  quote: string;
  citation?: string;
}

export interface CtaBlockData {
  icon?: string;
  title: string;
  text?: string;
  highlight?: string;
  buttonLabel?: string;
  buttonTarget?: string;
  buttonUrl?: string;
  photos?: BlockPhoto[];
}

export interface TimelineItem {
  year: string;
  title: string;
  text?: string;
  photo?: BlockPhoto;
}

export interface TimelineData {
  heading?: string;
  subheading?: string;
  items: TimelineItem[];
}

export interface InfoCardData {
  badgeIcon?: string;
  badgeText?: string;
  title: string;
  text?: string;
  addressLine?: string;
  photo?: BlockPhoto;
}

export interface PhotoCardItem {
  photo?: BlockPhoto;
  icon?: string;
  badge?: string;
  // Icon shown inside the badge pill and the color it's styled with.
  // Undefined keeps the original look (clock icon, red).
  badgeIcon?: string;
  badgeColor?: string;
  title: string;
  text?: string;
  linkLabel?: string;
  linkTarget?: string;
}

export interface PhotoCardGridData {
  heading?: string;
  subheading?: string;
  highlight?: string;
  cards: PhotoCardItem[];
}

export interface ScheduleItem {
  label: string;
  time: string;
}

export interface ScheduleCardData {
  photo?: BlockPhoto;
  heading?: string;
  subheading?: string;
  schedule: ScheduleItem[];
  text?: string;
  highlight?: string;
}

export interface ChecklistItem {
  title: string;
  text?: string;
}

export interface ChecklistCardData {
  eyebrow?: string;
  heading?: string;
  items: ChecklistItem[];
  noteIcon?: string;
  noteTitle?: string;
  noteText?: string;
  photo?: BlockPhoto;
}

export interface TextSectionNote {
  icon?: string;
  text: string;
}

export interface TextSection {
  icon?: string;
  heading: string;
  text?: string;
  notes?: TextSectionNote[];
}

export type PhotoAspectRatio = 'square' | 'landscape' | 'portrait';

export interface TextSectionsData {
  photos?: BlockPhoto[];
  photosPosition?: 'left' | 'right';
  photoAspectRatio?: PhotoAspectRatio;
  sections: TextSection[];
}

export interface MapEmbedData {
  heading?: string;
  subheading?: string;
  embedUrl: string;
}

export interface TagItem {
  label: string;
  description?: string;
  linkTarget?: string;
  linkUrl?: string;
}

export interface TagGroup {
  heading: string;
  tags: TagItem[];
}

export interface TagGroupsData {
  heading?: string;
  subheading?: string;
  icon?: string;
  groups: TagGroup[];
}

export interface VariableSymbolItem {
  code: string;
  label: string;
  description?: string;
  photo?: BlockPhoto;
}

export interface SupportOptionsData {
  heading?: string;
  description?: string;
  icon?: string;
  financial: {
    icon?: string;
    title: string;
    text?: string;
    highlight?: string;
    bankName?: string;
    accountNumber: string;
    iban: string;
    variableSymbols: VariableSymbolItem[];
  };
  involvement: {
    icon?: string;
    title: string;
    text?: string;
    photo?: BlockPhoto;
    linkLabel?: string;
    linkTarget?: string;
    linkUrl?: string;
  };
}

export interface SocialLink {
  icon?: string;
  label: string;
  url: string;
}

export interface SocialCardData {
  heading?: string;
  text?: string;
  links: SocialLink[];
  photo?: BlockPhoto;
  photoAspectRatio?: PhotoAspectRatio;
  embed?: MapEmbedData;
}

export interface PeopleListData {
  icon?: string;
  heading?: string;
  subheading?: string;
  people: string[];
}

export interface ListCardData {
  icon?: string;
  heading?: string;
  subheading?: string;
  items: ChecklistItem[];
}

export interface CardGridIconCard {
  kind: 'icon';
  icon?: string;
  title: string;
  text?: string;
}

export interface CardGridListCard {
  kind: 'list';
  icon?: string;
  heading?: string;
  subheading?: string;
  items: ChecklistItem[];
  wide?: boolean;
}

export interface CardGridPeopleCard {
  kind: 'people';
  icon?: string;
  heading?: string;
  subheading?: string;
  people: string[];
}

export type CardGridItem = CardGridIconCard | CardGridListCard | CardGridPeopleCard;

export interface CardGridData {
  heading?: string;
  subheading?: string;
  cards: CardGridItem[];
}

export interface CardBadge {
  label: string;
  highlight?: boolean;
}

export interface BadgeCardData {
  icon?: string;
  heading?: string;
  subheading?: string;
  badges?: CardBadge[];
  text?: string;
}

export interface ArticlesBlockData {
  icon?: string;
  heading?: string;
  description?: string;
  // Podle čeho se seznam na webu řadí — datum konání akce (výchozí), nebo
  // datum, kdy byl článek přidán do administrace.
  sortBy?: 'eventDate' | 'created';
  // Směr řazení — od nejnižší hodnoty (výchozí), nebo od nejvyšší.
  sortDir?: 'asc' | 'desc';
}

export interface HomeHeroData {
  pillText?: string;
  title: string;
  highlightWord?: string;
  text?: string;
  buttonLabel?: string;
  buttonTarget?: string;
  buttonUrl?: string;
  secondaryButtonLabel?: string;
  secondaryButtonTarget?: string;
  secondaryButtonUrl?: string;
  photo?: BlockPhoto;
}

// No configurable fields — SermonsBlock always renders the full sermon
// library (search, category filter, player) straight from the DB.
export type SermonsBlockData = Record<string, never>;

export interface EmailContactItem {
  email: string;
  description?: string;
}

// The "E-mailové kontakty" card and the "Napište nám zprávu" form shown
// together on Kontakt — one block since they always appear side by side.
// Submissions save to the contact_messages table (viewed in admin as
// "Oznamy"); this block has no knowledge of that beyond the topic options.
export interface ContactFormBlockData {
  emailsHeading?: string;
  emailsSubheading?: string;
  contacts: EmailContactItem[];
  formHeading?: string;
  formText?: string;
  topics?: string[];
}

export type BlockData =
  | PageHeroData
  | HomeHeroData
  | IconGridData
  | QuoteData
  | CtaBlockData
  | TimelineData
  | InfoCardData
  | PhotoCardGridData
  | ScheduleCardData
  | ChecklistCardData
  | ListCardData
  | CardGridData
  | BadgeCardData
  | TextSectionsData
  | MapEmbedData
  | TagGroupsData
  | SupportOptionsData
  | SocialCardData
  | PeopleListData
  | ArticlesBlockData
  | SermonsBlockData
  | ContactFormBlockData;

export interface BlockInstance {
  id: string;
  type: BlockType;
  visible: boolean;
  order: number;
  data: BlockData;
  // When set, this block's data comes from a shared, reusable Section (see /admin/sekce)
  // instead of being page-specific — `data` is resolved from it and shouldn't be edited here.
  sectionId?: string;
  // Page-specific override: caps how many items/cards a shared section shows on THIS page
  // only (e.g. a homepage preview showing the first 3 of a 6-item list) — the section's own
  // data is untouched, and other pages using it are unaffected. Undefined/0 = show all.
  itemLimit?: number;
}

export interface PageDoc {
  blocks: BlockInstance[];
  title?: string | null;
  slug?: string | null;
  slugHistory?: string[];
  showInHeader?: boolean;
  showInFooter?: boolean;
  headerGroupId?: string;
  headerIcon?: string;
  protected?: boolean;
  createdAt?: unknown;
  createdBy?: string | null;
  updatedAt?: unknown;
  updatedBy?: string | null;
}
