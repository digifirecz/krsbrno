import { pgTable, varchar, boolean, integer, real, jsonb, text, timestamp, serial } from 'drizzle-orm/pg-core';

const datetime = (name: string) => timestamp(name, { mode: 'date' });
import type { BlockInstance, BlockType, BlockData } from '../blocks/types';

// Mirrors the former Firestore `pages` collection. `blocks` is the page's
// content (the same array the block editor already serializes); `slug_history`
// keeps old slugs so renamed pages still resolve + redirect.
export const pages = pgTable('pages', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 255 }),
  slug: varchar('slug', { length: 255 }),
  slugHistory: jsonb('slug_history').$type<string[]>().notNull(),
  blocks: jsonb('blocks').$type<BlockInstance[]>().notNull(),
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
export const sections = pgTable('sections', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  type: varchar('type', { length: 64 }).$type<BlockType>().notNull(),
  data: jsonb('data').$type<BlockData>().notNull(),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Homepage "Aktuality" cards. `order` is a SQL keyword -> column is `sort_order`.
export const articles = pgTable('articles', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull().default(''),
  subtitle: text('subtitle'),
  dateText: varchar('date_text', { length: 64 }).notNull().default(''),
  timeText: varchar('time_text', { length: 16 }),
  location: varchar('location', { length: 255 }),
  image: varchar('image', { length: 1024 }),
  focalX: real('focal_x'),
  focalY: real('focal_y'),
  zoom: real('zoom'),
  visible: boolean('visible').notNull().default(true),
  order: integer('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Header dropdown categories ("Kdo jsme", "Co děláme") — pages sharing one are
// merged into a single dropdown in the site header.
export const navGroups = pgTable('nav_groups', {
  id: varchar('id', { length: 64 }).primaryKey(),
  label: varchar('label', { length: 255 }).notNull(),
  order: integer('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Footer social icons. Empty at migration time but the admin screen creates them.
export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  icon: varchar('icon', { length: 64 }).notNull().default(''),
  url: varchar('url', { length: 1024 }).notNull().default(''),
  order: integer('sort_order').notNull().default(0),
});

// Generic key/value store: pageCounter, articleCounter, sectionCounter,
// homePage ({ pageId }), siteSettings ({ address, email, ... }).
export const meta = pgTable('meta', {
  id: varchar('id', { length: 64 }).primaryKey(),
  data: jsonb('data').$type<Record<string, unknown>>().notNull(),
});

// People with admin access, keyed by e-mail so a role can be assigned before
// the person ever signs in. `role` references roles.id below. `passwordHash`
// is null until the account's first password-reset (bootstrap path).
export const users = pgTable('users', {
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
export const passwordResetTokens = pgTable('password_reset_tokens', {
  token: varchar('token', { length: 128 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  expiresAt: datetime('expires_at').notNull(),
  createdAt: datetime('created_at'),
});

// Submissions from the public "Napište nám zprávu" contact form (viewed in
// admin under "Oznamy").
export const contactMessages = pgTable('contact_messages', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  topic: varchar('topic', { length: 255 }),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: datetime('created_at'),
});

// Catalog of available roles ('admin' → "Administrátor", 'sprava' → "Správce").
export const roles = pgTable('roles', {
  id: varchar('id', { length: 64 }).primaryKey(),
  label: varchar('label', { length: 255 }).notNull(),
  order: integer('sort_order').notNull().default(0),
});

// Categories for service recordings ("nedělní", "středeční", "příležitostné", …).
export const sermonCategories = pgTable('sermon_categories', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  order: integer('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Speakers, picked per recording.
export const sermonSpeakers = pgTable('sermon_speakers', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull().default(''),
  order: integer('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});

// Service recordings — an audio file plus metadata. `audio_url` points at a
// Supabase Storage object under the `audio` bucket.
export const sermons = pgTable('sermons', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull().default(''),
  speakerId: varchar('speaker_id', { length: 64 }),
  date: datetime('sermon_date'),
  categoryId: varchar('category_id', { length: 64 }),
  description: text('description'),
  audioUrl: varchar('audio_url', { length: 1024 }),
  youtubeUrl: varchar('youtube_url', { length: 1024 }),
  visible: boolean('visible').notNull().default(true),
  order: integer('sort_order').notNull().default(0),
  createdAt: datetime('created_at'),
  createdBy: varchar('created_by', { length: 255 }),
  updatedAt: datetime('updated_at'),
  updatedBy: varchar('updated_by', { length: 255 }),
});
