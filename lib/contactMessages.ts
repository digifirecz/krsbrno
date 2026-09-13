// Shared types for contact-form submissions ("Napište nám zprávu" on Kontakt,
// viewed in admin under "Oznamy"). Implementation lives in
// lib/data/contactMessages.ts (server, Drizzle), exposed to client components
// through lib/actions/contactMessages.ts.

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic?: string;
  message: string;
  read: boolean;
  createdAt?: Date | null;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  topic?: string;
  message: string;
}
