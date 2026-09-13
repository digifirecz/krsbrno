import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/db/schema';
import { nextId } from '@/lib/data/counters';
import type { ContactMessage, ContactMessageInput } from '@/lib/contactMessages';

type Row = typeof contactMessages.$inferSelect;

function fromRow(r: Row): ContactMessage {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    topic: r.topic || undefined,
    message: r.message,
    read: !!r.read,
    createdAt: r.createdAt ?? null,
  };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  return rows.map(fromRow);
}

export async function createContactMessage(input: ContactMessageInput): Promise<string> {
  const id = await nextId('contactMessageCounter');
  await db.insert(contactMessages).values({
    id,
    name: input.name.trim(),
    email: input.email.trim(),
    topic: input.topic || null,
    message: input.message.trim(),
    read: false,
    createdAt: new Date(),
  });
  return id;
}

export async function markContactMessageRead(id: string, read: boolean): Promise<void> {
  await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
}

export async function deleteContactMessage(id: string): Promise<void> {
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}
