export interface Meeting {
  id: string;
  title: string;
  time: string;
  day: string;
  description: string;
  targetGroup?: string;
  badge?: string;
}

export interface GroupActivity {
  id: string;
  name: string;
  subTitle: string;
  ageRange: string;
  meetingTime: string;
  description: string;
  details: string[];
  contacts: { label: string; value: string; type: 'email' | 'instagram' | 'facebook' | 'web' }[];
  image: string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  bibleVerse: string;
  series: string;
  audioUrl: string;
  duration: string;
  summary: string;
  category: 'sunday' | 'wednesday' | 'conference' | 'occasional';
  year?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'Bohoslužba' | 'Mládež' | 'Děti' | 'Konference' | 'Speciální';
  description: string;
  location: string;
  image?: string;
}

export interface BeliefPillar {
  title: string;
  summary: string;
}

export interface LeadershipMember {
  name: string;
  role: string;
}

export const CHURCH_INFO = {
  name: "Křesťanský sbor Brno",
  shortName: "KS Brno",
  address: "Šámalova 15a, 615 00 Brno - Židenice",
  accountNumber: "2500752953/2010",
  bankName: "Fio banka, a.s.",
  iban: "CZ7320100000002500752953",
  bic: "FIOBCZPPXXX",
  emails: {
    general: "info@krsbrno.cz",
    admin: "administrator@krsbrno.cz",
    conference: "konference@krsbrno.cz",
    besidka: "besidka@krsbrno.cz",
    poutnici: "poutnickymail@gmail.com",
    elevate: "elevate@krsbrno.cz",
  },
  socials: {
    youtube: "https://youtube.com",
    instagram: "https://instagram.com/elevate_brno",
    facebook: "https://facebook.com",
  },
  transport: "Tramvaj č. 6, 8 a 10 (zastávka Geislerova) nebo auto (parkování v přilehlých ulicích – zóna C).",
};

export const REGULAR_MEETINGS: Meeting[] = [
  {
    id: 'sunday',
    title: 'Nedělní bohoslužba',
    day: 'Každou neděli',
    time: '9:30 – 11:00',
    description: 'Společné chvály, biblické kázání a připomínka toho, co pro nás Ježíš Kristus udělal.',
    badge: 'Hlavní setkání',
  },
  {
    id: 'wednesday',
    title: 'Středeční vyučování',
    day: 'Každou středu',
    time: '17:45 – 18:45',
    description: 'Společné studium Bible a hledání odpovědí na otázky víry v přátelské atmosféře.',
    badge: 'Studium Bible',
  },
  {
    id: 'friday',
    title: 'Páteční modlitební',
    day: 'Každý pátek',
    time: '17:45 – 18:45',
    description: 'Společné modlitby, sdílení potrubí i radostí a zamyšlení nad Božím slovem.',
    badge: 'Modlitby',
  },
];

export const GROUPS_DATA: GroupActivity[] = [
  {
    id: 'besidka',
    name: 'Děti – Besídka',
    subTitle: 'Program pro děti a rodiny s dětmi',
    ageRange: '1 – 12 let',
    meetingTime: 'Neděle během bohoslužby (od 9:30)',
    description: 'Během nedělní bohoslužby probíhá paralelní program pro děti rozdělený podle věku. Děti zažívají příběhy z Bible, zpívají písničky, tvoří a hrají hry.',
    details: [
      'Provozován v bezpečném a podnětném prostředí sborového zázemí',
      'Speciální skupinka pro nejmenší děti (do 5 let)',
      'Starší děti probírají biblická témata srozumitelnou formou',
      'Pravidelné rodinné akce, vánoční besídka a letní dětský tábor'
    ],
    contacts: [
      { label: 'E-mail', value: 'besidka@krsbrno.cz', type: 'email' },
    ],
    image: 'https://picsum.photos/seed/churchkids/800/500',
  },
  {
    id: 'poutnici',
    name: 'Dorost – Poutníci',
    subTitle: 'Parta mladých lidí na společné cestě',
    ageRange: '12 – 15 let',
    meetingTime: 'Jednou za 14 dní (Sobota 10:30 nebo Neděle 12:00)',
    description: 'Jsme mezipatro mezi besídkou a mládeží. Společně objevujeme víru, hrajeme deskovky i akční hry, vaříme oběd, čteme Bibli a budujeme přátelství.',
    details: [
      'Neformální atmosféra s dostatkem prostoru pro otázky',
      'Venkovní aktivity: minigolf, bowling, lasergame, bruslení',
      '3x ročně víkendové pobyty na horách a v přírodě',
      'Skvělý kolektiv vrstevníků'
    ],
    contacts: [
      { label: 'E-mail', value: 'poutnickymail@gmail.com', type: 'email' },
      { label: 'Instagram', value: '@poutnici_brno', type: 'instagram' },
    ],
    image: 'https://picsum.photos/seed/poutnici/800/500',
  },
  {
    id: 'elevate',
    name: 'Mládež – Elevate',
    subTitle: 'Prostor pro středoškoláky, vysokoškoláky a mladé dospělé',
    ageRange: '15 – 30 let',
    meetingTime: 'Každý čtvrtek od 18:00',
    description: 'Život je lepší, když máme přátele, se kterými se sdílíme a navzájem si pomáháme. Hledáme reálný smysl života v Ježíši Kristu a užíváme si společný čas.',
    details: [
      'Pravidelná čtvrteční setkání s modlitbou, chválami a diskusí',
      'Víkendovky, letní pobyty a zimní výjezdy',
      'Společenské večery, sport, deskovky a přespávačky',
      'Můžete se zapojit i do sdíleného Google Kalendáře akcí'
    ],
    contacts: [
      { label: 'E-mail', value: 'elevate@krsbrno.cz', type: 'email' },
      { label: 'Instagram', value: '@elevate_brno', type: 'instagram' },
      { label: 'Facebook', value: 'Mládež Elevate Brno', type: 'facebook' },
    ],
    image: 'https://picsum.photos/seed/youthgroup/800/500',
  },
  {
    id: 'knihovna',
    name: 'Knihovna DEN',
    subTitle: 'Křesťanská knihovna a půjčovna v Brně',
    ageRange: 'Všechny věkové kategorie',
    meetingTime: 'Středa 18:00 – 19:00 | Neděle 10:00 – 12:00',
    description: 'Knihovna DEN je otevřené místo pro každého, kdo má rád knihy, chce se vzdělávat nebo hledá odpovědi na otázky o víře, vztazích a životě.',
    details: [
      'Bohatý výběr křesťanské literatury, teologie, historie i beletrie',
      'Příručky pro rodinu, výchovu, manželství i dětské knihy',
      'Půjčování zdarma po jednoduché registraci na 1 rok',
      'Klidné prostředí pro čtení a kávu v přízemí sboru'
    ],
    contacts: [
      { label: 'E-mail', value: 'info@krsbrno.cz', type: 'email' },
    ],
    image: 'https://picsum.photos/seed/libraryden/800/500',
  },
];

export const SERMONS_DATA: Sermon[] = [
  // Sunday
  {
    id: 'sermon-1',
    title: 'Skutečná naděje v nejisté době',
    speaker: 'Aleš Drbal',
    date: '29.7.2026',
    bibleVerse: 'Rim 15,13',
    series: 'Bůh naší naděje',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '38 min',
    summary: 'Proč biblická naděje není jen přání, ale pevná kotva duše ukotvená v Kristově vzkříšení.',
    category: 'sunday',
  },
  {
    id: 'sermon-2',
    title: 'Odpuštění jako cesta ke svobodě',
    speaker: 'Petr Jahůdka',
    date: '22.7.2026',
    bibleVerse: 'Efezským 4,31-32',
    series: 'Život v praktických vztazích',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '42 min',
    summary: 'Jak prakticky opustit hořkost a zakusit Boží milost v každodenních konfliktech.',
    category: 'sunday',
  },
  {
    id: 'sermon-3',
    title: 'Církev – rodina, kde nikdo není sám',
    speaker: 'Miloš Kašparec',
    date: '15.7.2026',
    bibleVerse: '1. Korintským 12,12-27',
    series: 'Identita sboru',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '35 min',
    summary: 'Co znamená tvořit tělo Kristovo a jak každý z nás přispívá svými obdarováními.',
    category: 'sunday',
  },
  {
    id: 'sermon-4',
    title: 'Moc modlitby v běžném dni',
    speaker: 'Petr Libánský ml.',
    date: '8.7.2026',
    bibleVerse: 'Filipským 4,6-7',
    series: 'Modlitba',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '40 min',
    summary: 'Přeměna úzkosti v pokoj skrze neustálý rozhovor s Otcem.',
    category: 'sunday',
  },
  {
    id: 'sermon-5',
    title: 'Hojnost vděčnosti',
    speaker: 'Jakub Lofítek',
    date: '1.7.2026',
    bibleVerse: 'Koloským 3,15-17',
    series: 'Nedělní vyučování',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '45 min',
    summary: 'Jak vděčnost proměňuje náš pohled na zkoušky a každodenní povinnosti.',
    category: 'sunday',
  },

  // Wednesday
  {
    id: 'wed-1',
    title: 'Studium Listu Židům – Kapitola 11',
    speaker: 'Aleš Drbal',
    date: '26.7.2026',
    bibleVerse: 'Židům 11,1-6',
    series: 'Síň víry',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: '52 min',
    summary: 'Co je to živá víra a jak svědkové starověku kráčeli s Bohem v neznámých situacích.',
    category: 'wednesday',
  },
  {
    id: 'wed-2',
    title: 'Izajáš 53 – Trpící služebník',
    speaker: 'Petr Jahůdka',
    date: '19.7.2026',
    bibleVerse: 'Izajáš 53,1-12',
    series: 'Proroci Starého zákona',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: '48 min',
    summary: 'Hluboký pohled na Mesiášovo utrpení a vykoupení, které nám přinesl.',
    category: 'wednesday',
  },
  {
    id: 'wed-3',
    title: 'Skutkové apoštolů – Církev v Antiochii',
    speaker: 'Miloš Kašparec',
    date: '12.7.2026',
    bibleVerse: 'Skutkové 11,19-26',
    series: 'První křesťané',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: '50 min',
    summary: 'Jak vypadá zdravá misijní církev, kde byli učedníci poprvé nazváni křesťany.',
    category: 'wednesday',
  },

  // Conferences (2025, 2024, 2023)
  {
    id: 'conf-2025-1',
    title: 'Zdroje a příklady radosti a vděčnosti',
    speaker: 'Petr Jahůdka',
    date: '11.10.2025',
    bibleVerse: '1. Tesalonickým 5,16-18',
    series: '2025 - Vděčnost a radost jako životní postoj',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    duration: '45 min',
    summary: 'Úvod do tématu konference a biblické kořeny radosti v Pánu.',
    category: 'conference',
    year: '2025',
  },
  {
    id: 'conf-2025-2',
    title: 'Radost z Boha a vděčnost za to, kdo je, kým je a jaký je',
    speaker: 'Libor Osouch ml.',
    date: '11.10.2025',
    bibleVerse: 'Žalm 103,1-5',
    series: '2025 - Vděčnost a radost jako životní postoj',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    duration: '50 min',
    summary: 'Zkoumání Božích vlastností jako věčného zdroje naší chvály.',
    category: 'conference',
    year: '2025',
  },
  {
    id: 'conf-2025-3',
    title: 'Příklad Ježíšovy vděčnosti a radosti',
    speaker: 'Pazdera Viktor',
    date: '11.10.2025',
    bibleVerse: 'Lukáš 10,21',
    series: '2025 - Vděčnost a radost jako životní postoj',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '42 min',
    summary: 'Jak Pán Ježíš prožíval radost v Duchu svatém uprostřed náročného poslání.',
    category: 'conference',
    year: '2025',
  },
  {
    id: 'conf-2025-4',
    title: 'Radost a vděčnost za spasení a nový život',
    speaker: 'Kuchař Roman',
    date: '11.10.2025',
    bibleVerse: 'Římanům 5,1-5',
    series: '2025 - Vděčnost a radost jako životní postoj',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '46 min',
    summary: 'Osvobozující pravda o ospravedlnění z víry a pokoji s Bohem.',
    category: 'conference',
    year: '2025',
  },
  {
    id: 'conf-2024-1',
    title: 'Církev v proměnách doby – Věrnost evangeliu',
    speaker: 'Aleš Drbal',
    date: '12.10.2024',
    bibleVerse: '2. Timoteovi 4,1-5',
    series: '2024 - Církev v proměnách doby',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '48 min',
    summary: 'Jak obstát jako věrní svědkové v dnešním rychle se měnícím světě.',
    category: 'conference',
    year: '2024',
  },
  {
    id: 'conf-2024-2',
    title: 'Křesťanská rodina jako bezpečný přístav',
    speaker: 'Petr Jahůdka',
    date: '12.10.2024',
    bibleVerse: 'Efezským 5,21 – 6,4',
    series: '2024 - Církev v proměnách doby',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: '52 min',
    summary: 'Výzvy a požehnání v manželském a rodičovském životě podle Písma.',
    category: 'conference',
    year: '2024',
  },
  {
    id: 'conf-2023-1',
    title: 'Učedníkem v 21. století',
    speaker: 'Miloš Kašparec',
    date: '14.10.2023',
    bibleVerse: 'Matouš 28,18-20',
    series: '2023 - Učedníkem v 21. století',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: '50 min',
    summary: 'Praktické kroky k hlubšímu následování Krista v každodenní rutině.',
    category: 'conference',
    year: '2023',
  },

  // Occasional
  {
    id: 'occ-1',
    title: 'Svatba: Boží plán pro manželství',
    speaker: 'Aleš Drbal',
    date: '15.6.2026',
    bibleVerse: 'Genezis 2,18-24',
    series: 'Příležitostná kázání',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: '28 min',
    summary: 'Slavnostní svatební slovo o lásce, věrnosti a Boží přítomnosti v manželství.',
    category: 'occasional',
  },
  {
    id: 'occ-2',
    title: 'Předání svědectví víry (Křest)',
    speaker: 'Petr Jahůdka',
    date: '10.5.2026',
    bibleVerse: 'Římanům 6,3-4',
    series: 'Příležitostná kázání',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: '32 min',
    summary: 'Význam křtu z víry a nový život v moci Vzkříšeného.',
    category: 'occasional',
  },
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    title: 'Kyberdítě a jeho sítě',
    date: '7. 2. 2026',
    time: '16:00 – 19:00',
    category: 'Speciální',
    description: 'Přednáška a diskuse o bezpečném pohybu dětí na internetu a sociálních sítích. Odolný dospělý = odolné dítě.',
    location: 'Sborový sál, Šámalova 15a',
    image: 'https://picsum.photos/seed/cyberchild/600/400',
  },
  {
    id: 'ev-2',
    title: 'Jarní víkendovka Mládeže',
    date: '20. - 22. 2. 2026',
    time: 'Pátek 17:00 - Neděle 15:00',
    category: 'Mládež',
    description: 'Víkendový pobyt mládeže Elevate v přírodě plný her, biblických zamyšlení a společných večerů.',
    location: 'Chata Vysočina',
    image: 'https://picsum.photos/seed/youthweekend/600/400',
  },
  {
    id: 'ev-3',
    title: 'Večer chval LIGHT',
    date: '6. 3. 2026',
    time: '18:30 – 20:30',
    category: 'Speciální',
    description: 'Otevřený večer modliteb, živých chval a meditace nad Božím slovem v neformálním prostředí.',
    location: 'Sborový sál, Šámalova 15a',
    image: 'https://picsum.photos/seed/worshipnight/600/400',
  },
  {
    id: 'ev-4',
    title: 'Velikonoční bohoslužba a křest',
    date: '5. 4. 2026',
    time: '9:30 – 11:30',
    category: 'Bohoslužba',
    description: 'Slavnostní velikonoční shromáždění se slavností křtu nových věřících a společným obědem.',
    location: 'Sborový sál, Šámalova 15a',
    image: 'https://picsum.photos/seed/easterbaptism/600/400',
  },
];

export const BELIEFS_PILLARS: BeliefPillar[] = [
  {
    title: 'Vznik dobra',
    summary: 'Bůh stvořil svět jako dobrý a smysluplný pro vztah se sebou i ostatními. Život v Boží blízkosti přináší plnost radosti.',
  },
  {
    title: 'Vznik zla',
    summary: 'Zlo není Božím záměrem. Lidská svoboda a odvrácení se od Boha přinesly do světa bolest, pýchu a duchovní prázdnotu.',
  },
  {
    title: 'Záchrana světa',
    summary: 'Bůh poslal Ježíše Krista, aby zemřel za naše hříchy a stal se cestou ke smíření s Bohem. Záchrana je dar milosti skrze víru.',
  },
  {
    title: 'Naděje budoucnosti',
    summary: 'Smrtí život nekončí. Člověk je stvořen pro věčnost a Bůh zaslibuje nový svět bez bolesti, slz a nespravedlnosti.',
  },
  {
    title: 'Nový začátek',
    summary: 'Víra začíná osobním rozhodnutím důvěřovat Ježíši Kristu. Křest je veřejným vyjádřením proměny srdce.',
  },
  {
    title: 'Církev',
    summary: 'Církev není budova ani instituce, ale společenství nedokonalých lidí, kteří se učit žít víru prakticky v lásce a službě.',
  },
  {
    title: 'Boží působení',
    summary: 'Bůh není vzdálený. V životě věřícího působí Duch svatý, který proměňuje naše srdce, charakter a vztahy.',
  },
  {
    title: 'Boží slovo – Bible',
    summary: 'Bible je Bohem inspirovaná kniha, která nás vede k poznání pravdy, moudrosti a Božího plánu pro člověka.',
  },
  {
    title: 'Modlitba',
    summary: 'Modlitba je osobní rozhovor s Bohem – prostor pro vděčnost, prosby i tiché naslouchání Jeho vedení.',
  },
  {
    title: 'Chvály',
    summary: 'Hudba a zpěv jsou přirozeným vyjádřením vděčnosti a úcty vůči Bohu za vše, co pro nás vykonal.',
  },
];

export const FULL_STATEMENT_OF_FAITH = [
  {
    heading: 'Věříme, že Bůh',
    items: [
      'je jediný Vládce celého vesmíru a je duchovní Bytost',
      'je svatý a dokonalý, stálý, neměnný a věčný',
      'Bůh má tři podstaty – Bůh Otec, Bůh Syn a Bůh Duch Svatý',
      'Stvořil celý svět, celou přírodu a také člověka',
      'Nesnáší hřích, ale miluje hříšníka a touží po osobním vztahu s člověkem',
    ],
  },
  {
    heading: 'Věříme, že Ježíš Kristus',
    items: [
      'Je Boží Syn se všemi charakteristikami Pána Boha',
      'Byl počat z Ducha svatého a narodil se z panny',
      'Byl a je Bůh, ale byl i člověk se základními znaky člověka',
      'Na Zemi žil dokonalý život bez hříchu',
      'Třetí den po ukřižování ho Bůh Otec vzkřísil z mrtvých',
      'Bůh Otec ho poslal na Zem v lidském těle, aby tu zemřel za hříšné lidi. Skrze tuto smrt mohou lidi získat odpuštění a být přijati mezi Boží lid.',
      'Jeho oběť očišťuje před Bohem od hříchu ty, kteří v Něj věří',
      'Jednou si přijde pro svou Církev a vezme ji k sobě',
      'je jediná cesta k Bohu Otci',
    ],
  },
  {
    heading: 'Věříme, že Duch svatý',
    items: [
      'Je osobou a dáva schopnost porozumět Božímu Slovu',
      'Dává duchovní dary věřícím lidem',
      'Prostřednictvím věřících lidí promlouvá k světu a usvědčuje jej z hříchu',
      'Inspiroval a vedl pisatele k sepsání Bible',
    ],
  },
  {
    heading: 'Věříme, že Církev',
    items: [
      'Patří Bohu, který je její hlavou',
      'Není dílem lidské organizace',
      'Vstup do Církve je osobní víra v oběť Ježíše Krista',
      'Čeká na druhý příchod Ježíše Krista',
    ],
  },
  {
    heading: 'Věříme, že Bible',
    items: [
      'Je Božím Slovem',
      'Je nezměnitelná, nezaměnitelná a neomylná kniha',
      'Je to soubor knih Starého a Nového zákona, který je úplný a nelze k němu nic dalšího dodávat',
      'Obsahuje pravidla pro život Božího lidu, plán spasení i nástin naší budoucnosti',
    ],
  },
];

export const HISTORY_TIMELINE = [
  {
    year: '1921',
    title: 'Počátky společenství v parku Lužánky',
    text: 'Po skončení 1. světové války v roce 1921 se v Brně scházeli dva muži – bratři, kteří v parku v Lužánkách čítali spolu Boží slovo na lavičce a modlili se za probuzení v městě Brně. K těmto prvním neformálním chvílím nad Biblí se postupně přidávali další lidé, kteří toužili po živém křesťanství, vzájemné bratrské lásce a společném hledání Boží vůle. Tak vznikly první kořeny Křesťanského sboru v Brně.',
  },
  {
    year: '1932',
    title: 'Oficiální vznik sboru v Židenicích',
    text: 'Sbor v Židenicích oficiálně vznikl v roce 1932. Zpočátku se věřící scházeli v čekárně lékařské ordinace MUDr. Jana Zemana. Rostoucí společenství brzy pořádalo pravidelné nedělní bohoslužby, modlitební chvíle a studium Písma. Věnovali se také evangelizaci a duchovní péči o potřebné v Brně a okolí.',
  },
  {
    year: '1948',
    title: 'Přesun na Šámalovu 15a a vznik besídky',
    text: 'V roce 1948 získal sbor prostory bývalé stolařské dílny ve dvoře objektu na Šámalově ulici 15a v Brně-Židenicích. Svépomocnou prací členů sboru byla dílna přestavěna na modlitebnu se sborovým sálem. Ve stejném období vznikla také první organizovaná nedělní besídka pro děti a dorost, která položila základ pro více než sedmdesátiletou tradici práce s dětským kolektivem.',
  },
  {
    year: '1956',
    title: 'Zákaz činnosti a komunistické persekuce',
    text: 'V únoru 1956 zasáhl tehdejší komunistický režim a činnost Křesťanských sborů byla oficiálně zakázána. Členové sboru byli vystaveni výsleshům a tlaku státní bezpečnosti. Později po jednáních s úřady bylo povoleno jediné oficiální místo shromáždění pro celé Brno právě v modlitebně na Šámalově ulici. Navzdory omezením a dohledu státu sbor vytrval ve věrnosti Kristu a pravidelná setkávání nepřestala.',
  },
  {
    year: '1999 – 2000',
    title: 'Rozšíření sborového domu a rekonstrukce',
    text: 'Po pádu totality získal sbor v letech 1999–2000 možnost odkouput dvorní trakt budovy na Šámalově 15a. Proběhla rozsáhlá celková rekonstrukce hlavního sálu, přístavba učeben pro děti a mládež, vybudování veřejné křesťanské knihovny DEN a sociálního zázemí. Sbor se stal živým centrem pro mnoho rodin, mládežnickou skupinu Elevate i mezinárodní konference.',
  },
  {
    year: '2020',
    title: 'Získání celého objektu & výhled do budoucna',
    text: 'V roce 2020 se sboru podařilo odkoupit i přední uliční budovu a rozlehlou zahradu, čímž se Křesťanský sbor Brno stal výlučným vlastníkem celého areálu na Šámalově 15a. Tento historický milník otevřel možnosti pro další modernizaci sborových prostor, komunitní zahradní akce, příměstské tábory pro děti i rozvoj služby městu pro nadcházející generace.',
  },
];

export const ELDERS_LIST = [
  'Aleš Drbal',
  'Petr Jahůdka',
  'Miloš Kašparec',
  'Petr Libánský ml.',
  'Jakub Lofítek',
  'Miloš Rauš',
  'Rostislav Zeman',
];

export const VARIABLE_SYMBOLS = [
  { code: '0009', label: 'Dar obecný (provoz sboru)' },
  { code: '1970', label: 'Matěj a Kristína Noví' },
  { code: '3915', label: 'Budova Šámalova (rekonstrukce)' },
];
