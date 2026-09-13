'use server';

// RPC layer for 'use client' components (and lib/routes.ts, which is bundled
// into client code). Server components should import lib/data/pages directly.

import * as data from '@/lib/data/pages';
import type { BlockInstance, PageDoc } from '@/lib/blocks/types';
import type { CustomPage, PageSlugEntry, PageNavEntry, NavGroup, ManagedPage } from '@/lib/pages';

export async function getPageBlocks(pageId: string): Promise<BlockInstance[] | null> {
  return data.getPageBlocks(pageId);
}

export async function getPageDoc(pageId: string): Promise<PageDoc | null> {
  return data.getPageDoc(pageId);
}

export async function savePageBlocks(
  pageId: string,
  blocks: BlockInstance[],
  title?: string | null,
  updatedBy?: string | null,
  navConfig?: { headerGroupId?: string; headerIcon?: string },
): Promise<string> {
  return data.savePageBlocks(pageId, blocks, title, updatedBy, navConfig);
}

export async function getCustomPages(): Promise<CustomPage[]> {
  return data.getCustomPages();
}

export async function getManagedPages(): Promise<ManagedPage[]> {
  return data.getManagedPages();
}

export async function getProtectedPageId(): Promise<string | null> {
  return data.getProtectedPageId();
}

export async function getAllPageSlugs(): Promise<PageSlugEntry[]> {
  return data.getAllPageSlugs();
}

export async function getNavConfig(): Promise<PageNavEntry[]> {
  return data.getNavConfig();
}

export async function setNavVisibility(
  pageId: string,
  visibility: { showInHeader?: boolean; showInFooter?: boolean; headerGroupId?: string; headerIcon?: string },
): Promise<void> {
  return data.setNavVisibility(pageId, visibility);
}

export async function resolvePageBySlug(slug: string): Promise<{ pageId: string; redirectSlug?: string } | null> {
  return data.resolvePageBySlug(slug);
}

export async function createPage(label: string, createdBy?: string | null): Promise<string> {
  return data.createPage(label, createdBy);
}

export async function deletePage(pageId: string): Promise<void> {
  return data.deletePage(pageId);
}

export async function getHomePageId(): Promise<string | null> {
  return data.getHomePageId();
}

export async function setHomePageId(pageId: string | null): Promise<void> {
  return data.setHomePageId(pageId);
}

export async function getNavGroups(): Promise<NavGroup[]> {
  return data.getNavGroups();
}

export async function createNavGroup(label: string, createdBy?: string | null): Promise<NavGroup> {
  return data.createNavGroup(label, createdBy);
}

export async function updateNavGroup(id: string, label: string, updatedBy?: string | null): Promise<void> {
  return data.updateNavGroup(id, label, updatedBy);
}

export async function deleteNavGroup(groupId: string): Promise<void> {
  return data.deleteNavGroup(groupId);
}
