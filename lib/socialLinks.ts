// Shared type for footer social links. Implementation lives in
// lib/data/socialLinks.ts (server, Drizzle); client components reach it through
// lib/actions/socialLinks.ts.

export interface SocialLink {
  id: string;
  icon: string;
  url: string;
  order: number;
}
