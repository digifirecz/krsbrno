'use server';

// RPC layer for 'use client' components (and lib/routes.ts, which is bundled
// into client code). Server components should import lib/data/pages directly.

import * as data from '@/lib/data/pages';
import type { BlockInstance, PageDoc } from '@/lib/blocks/types';
import type { CustomPage, PageSlugEntry, PageNavEntry, NavGroup, ManagedPage } from '@/lib/pages';
import { requireSession } from '@/lib/auth/session';
import { withAction } from '@/lib/sentryAction';

// Public — every content section on the site renders its blocks through this.
export const getPageBlocks = withAction('pages.getPageBlocks', async (pageId: string): Promise<BlockInstance[] | null> => {
  return data.getPageBlocks(pageId);
});

export const getPageDoc = withAction('pages.getPageDoc', async (pageId: string): Promise<PageDoc | null> => {
  await requireSession();
  return data.getPageDoc(pageId);
});

export const savePageBlocks = withAction('pages.savePageBlocks', async (pageId: string, blocks: BlockInstance[], title?: string | null, updatedBy?: string | null, navConfig?: { headerGroupId?: string; headerIcon?: string }): Promise<string> => {
  await requireSession();
  return data.savePageBlocks(pageId, blocks, title, updatedBy, navConfig);
});

export const getCustomPages = withAction('pages.getCustomPages', async (): Promise<CustomPage[]> => {
  await requireSession();
  return data.getCustomPages();
});

export const getManagedPages = withAction('pages.getManagedPages', async (): Promise<ManagedPage[]> => {
  await requireSession();
  return data.getManagedPages();
});

export const getProtectedPageId = withAction('pages.getProtectedPageId', async (): Promise<string | null> => {
  await requireSession();
  return data.getProtectedPageId();
});

// Public — used by lib/routes.ts to resolve incoming URLs for managed pages.
export const getAllPageSlugs = withAction('pages.getAllPageSlugs', async (): Promise<PageSlugEntry[]> => {
  return data.getAllPageSlugs();
});

// Public — fetched server-side via lib/chromeData.ts for the Navbar/Footer.
export const getNavConfig = withAction('pages.getNavConfig', async (): Promise<PageNavEntry[]> => {
  return data.getNavConfig();
});

export const setNavVisibility = withAction('pages.setNavVisibility', async (pageId: string, visibility: { showInHeader?: boolean; showInFooter?: boolean; headerGroupId?: string; headerIcon?: string }): Promise<void> => {
  await requireSession();
  return data.setNavVisibility(pageId, visibility);
});

// Public — used by lib/routes.ts to resolve incoming URLs for managed pages.
export const resolvePageBySlug = withAction('pages.resolvePageBySlug', async (slug: string): Promise<{ pageId: string; redirectSlug?: string } | null> => {
  return data.resolvePageBySlug(slug);
});

export const createPage = withAction('pages.createPage', async (label: string, createdBy?: string | null): Promise<string> => {
  await requireSession();
  return data.createPage(label, createdBy);
});

export const deletePage = withAction('pages.deletePage', async (pageId: string): Promise<void> => {
  await requireSession();
  return data.deletePage(pageId);
});

// Public — fetched server-side (app/page.tsx, app/[slug]/page.tsx) to know which managed page to render at "/".
export const getHomePageId = withAction('pages.getHomePageId', async (): Promise<string | null> => {
  return data.getHomePageId();
});

export const setHomePageId = withAction('pages.setHomePageId', async (pageId: string | null): Promise<void> => {
  await requireSession();
  return data.setHomePageId(pageId);
});

export const getNavGroups = withAction('pages.getNavGroups', async (): Promise<NavGroup[]> => {
  await requireSession();
  return data.getNavGroups();
});

export const createNavGroup = withAction('pages.createNavGroup', async (label: string, createdBy?: string | null): Promise<NavGroup> => {
  await requireSession();
  return data.createNavGroup(label, createdBy);
});

export const updateNavGroup = withAction('pages.updateNavGroup', async (id: string, label: string, updatedBy?: string | null): Promise<void> => {
  await requireSession();
  return data.updateNavGroup(id, label, updatedBy);
});

export const deleteNavGroup = withAction('pages.deleteNavGroup', async (groupId: string): Promise<void> => {
  await requireSession();
  return data.deleteNavGroup(groupId);
});
