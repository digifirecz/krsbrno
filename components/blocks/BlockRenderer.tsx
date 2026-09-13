import type { BlockInstance, PageHeroData, HomeHeroData, IconGridData, QuoteData, CtaBlockData, TimelineData, InfoCardData, PhotoCardGridData, ScheduleCardData, ChecklistCardData, ListCardData, CardGridData, BadgeCardData, TextSectionsData, MapEmbedData, TagGroupsData, SupportOptionsData, SocialCardData, PeopleListData, ArticlesBlockData, ContactFormBlockData } from '@/lib/blocks/types';
import PageHeroBlock from '@/components/blocks/PageHeroBlock';
import HomeHeroBlock from '@/components/blocks/HomeHeroBlock';
import IconGridBlock from '@/components/blocks/IconGridBlock';
import QuoteBlock from '@/components/blocks/QuoteBlock';
import CtaBlock from '@/components/blocks/CtaBlock';
import TimelineBlock from '@/components/blocks/TimelineBlock';
import InfoCardBlock from '@/components/blocks/InfoCardBlock';
import PhotoCardGridBlock from '@/components/blocks/PhotoCardGridBlock';
import ScheduleCardBlock from '@/components/blocks/ScheduleCardBlock';
import ChecklistCardBlock from '@/components/blocks/ChecklistCardBlock';
import ListCardBlock from '@/components/blocks/ListCardBlock';
import CardGridBlock from '@/components/blocks/CardGridBlock';
import BadgeCardBlock from '@/components/blocks/BadgeCardBlock';
import TextSectionsBlock from '@/components/blocks/TextSectionsBlock';
import MapEmbedBlock from '@/components/blocks/MapEmbedBlock';
import TagGroupsBlock from '@/components/blocks/TagGroupsBlock';
import SupportOptionsBlock from '@/components/blocks/SupportOptionsBlock';
import SocialCardBlock from '@/components/blocks/SocialCardBlock';
import PeopleListBlock from '@/components/blocks/PeopleListBlock';
import ArticlesBlock from '@/components/blocks/ArticlesBlock';
import SermonsBlock from '@/components/blocks/SermonsBlock';
import ContactFormBlock from '@/components/blocks/ContactFormBlock';
import ScrollReveal from '@/components/blocks/ScrollReveal';

function renderBlockContent(block: BlockInstance): React.ReactNode {
  switch (block.type) {
    case 'pageHero':
      return <PageHeroBlock data={block.data as PageHeroData} />;
    case 'homeHero':
      return <HomeHeroBlock data={block.data as HomeHeroData} />;
    case 'iconGrid':
      return <IconGridBlock data={block.data as IconGridData} />;
    case 'quote':
      return <QuoteBlock data={block.data as QuoteData} />;
    case 'ctaBlock':
      return <CtaBlock data={block.data as CtaBlockData} />;
    case 'timeline':
      return <TimelineBlock data={block.data as TimelineData} />;
    case 'infoCard':
      return <InfoCardBlock data={block.data as InfoCardData} />;
    case 'photoCardGrid':
      return <PhotoCardGridBlock data={block.data as PhotoCardGridData} limit={block.itemLimit} />;
    case 'scheduleCard':
      return <ScheduleCardBlock data={block.data as ScheduleCardData} />;
    case 'checklistCard':
      return <ChecklistCardBlock data={block.data as ChecklistCardData} />;
    case 'listCard':
      return <ListCardBlock data={block.data as ListCardData} />;
    case 'cardGrid':
      return <CardGridBlock data={block.data as CardGridData} />;
    case 'badgeCard':
      return <BadgeCardBlock data={block.data as BadgeCardData} />;
    case 'textSections':
      return <TextSectionsBlock data={block.data as TextSectionsData} />;
    case 'mapEmbed':
      return <MapEmbedBlock data={block.data as MapEmbedData} />;
    case 'tagGroups':
      return <TagGroupsBlock data={block.data as TagGroupsData} />;
    case 'supportOptions':
      return <SupportOptionsBlock data={block.data as SupportOptionsData} />;
    case 'socialCard':
      return <SocialCardBlock data={block.data as SocialCardData} />;
    case 'peopleList':
      return <PeopleListBlock data={block.data as PeopleListData} />;
    case 'articlesBlock':
      return <ArticlesBlock data={block.data as ArticlesBlockData} />;
    case 'sermonsBlock':
      return <SermonsBlock />;
    case 'contactFormBlock':
      return <ContactFormBlock data={block.data as ContactFormBlockData} />;
    default:
      return null;
  }
}

export default function BlockRenderer({ blocks }: { blocks: BlockInstance[] }) {
  const visibleBlocks = [...blocks]
    .filter((block) => block.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {visibleBlocks.map((block) => {
        const content = renderBlockContent(block);
        if (!content) return null;
        return (
          <ScrollReveal key={block.id}>
            {content}
          </ScrollReveal>
        );
      })}
    </>
  );
}
