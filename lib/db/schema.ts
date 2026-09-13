import { mysqlTable, varchar, boolean, int, json, text, datetime as datetimeCol } from 'drizzle-orm/mysql-core';

const datetime = (name: string) => datetimeCol(name, { mode: 'date' });
import type { BlockInstance, BlockType, BlockData } from '../blocks/types';

// Mirrors the former Firestore `pages` collection. `blocks` is the page's
// content (the same array the block editor already serializes); `slug_history`
// keeps old slugs so renamed pages still resolve + redirect.
export const pages = mysqlTable('pages', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 255 }),
  slug: varchar('slug', { length: 255 }),
  slugHistory: json('slug_history').$type<string[]>().notNull(),
  blocks: json('blocks').$type<BlockInstance[]>().notNull(),
  showInHeader: boolean('show_in_header').notNull().default(false),
  showInFooter: boolean('show_in_footer').notNull().default(false),
  headerGroupId: varchar('header_group_id', { length: 64 }).notNull().default(''),
  headerIcon: varchar('header_icon', { length: 64 }),
  protected: boolean('protected').notNull().default(false),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Reusable content blocks referenced by pages via BlockInstance.sectionId.
export const sections = mysqlTable('sections', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  type: varchar('type', { length: 64 }).$type<BlockType>().notNull(),
  data: json('data').$type<BlockData>().notNull(),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Homepage "Aktuality" cards. `order` is a SQL keyword -> column is `sort_order`.
export const articles = mysqlTable('articles', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull().default(''),
  subtitle: varchar('subtitle', { length: 512 }),
  dateText: varchar('date_text', { length: 64 }).notNull().default(''),
  image: varchar('image', { length: 1024 }),
  visible: boolean('visible').notNull().default(true),
  order: int('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Header dropdown categories ("Kdo jsme", "Co děláme") — pages sharing one are
// merged into a single dropdown in the site header.
export const navGroups = mysqlTable('nav_groups', {
  id: varchar('id', { length: 64 }).primaryKey(),
  label: varchar('label', { length: 255 }).notNull(),
  order: int('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Footer social icons. Empty at migration time but the admin screen creates them.
export const socialLinks = mysqlTable('social_links', {
  id: int('id').primaryKey().autoincrement(),
  icon: varchar('icon', { length: 64 }).notNull().default(''),
  url: varchar('url', { length: 1024 }).notNull().default(''),
  order: int('sort_order').notNull().default(0),
});

// Generic key/value store: pageCounter, articleCounter, sectionCounter,
// homePage ({ pageId }), siteSettings ({ address, email, ... }).
export const meta = mysqlTable('meta', {
  id: varchar('id', { length: 64 }).primaryKey(),
  data: json('data').$type<Record<string, unknown>>().notNull(),
});

// People with admin access, keyed by e-mail so a role can be assigned before
// the person ever signs in. `role` references roles.id below. `passwordHash`
// is null until the account's first password-reset (bootstrap path).
export const users = mysqlTable('users', {
  email: varchar('email', { length: 255 }).primaryKey(),
  role: varchar('role', { length: 32 }).notNull().default('sprava'),
  passwordHash: varchar('password_hash', { length: 255 }),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Single-use password reset links. `token` is the random secret itself (the
// lookup key); consuming it deletes the row, enforcing one-time use.
export const passwordResetTokens = mysqlTable('password_reset_tokens', {
  token: varchar('token', { length: 128 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  expiresAt: datetime('expires_at').notNull(),
  createdAt: datetime('created_at'),
});

// Catalog of available roles ('admin' → "Administrátor", 'sprava' → "Správce").
export const roles = mysqlTable('roles', {
  id: varchar('id', { length: 64 }).primaryKey(),
  label: varchar('label', { length: 255 }).notNull(),
  order: int('sort_order').notNull().default(0),
});

// Categories for service recordings ("nedělní", "středeční", "příležitostné", …).
export const sermonCategories = mysqlTable('sermon_categories', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  order: int('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Speakers, picked per recording.
export const sermonSpeakers = mysqlTable('sermon_speakers', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  order: int('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Service recordings — an audio file plus metadata. `audio_url` points at a
// local file under /public/audio/sermons/<id>/.
export const sermons = mysqlTable('sermons', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull().default(''),
  speakerId: varchar('speaker_id', { length: 64 }),
  date: datetimeCol('sermon_date', { mode: 'date' }),
  categoryId: varchar('category_id', { length: 64 }),
  description: text('description'),
  audioUrl: varchar('audio_url', { length: 1024 }),
  visible: boolean('visible').notNull().default(true),
  order: int('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});
