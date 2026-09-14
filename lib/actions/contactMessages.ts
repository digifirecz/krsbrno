'use server';

import * as data from '@/lib/data/contactMessages';
import type { ContactMessage, ContactMessageInput } from '@/lib/contactMessages';
import { requireSession } from '@/lib/auth/session';

export async function getContactMessages(): Promise<ContactMessage[]> {
  await requireSession();
  return data.getContactMessages();
}

// Public — this is the contact form submit itself, must stay open to visitors.
export async function createContactMessage(input: ContactMessageInput): Promise<string> {
  return data.createContactMessage(input);
}

export async function markContactMessageRead(id: string, read: boolean): Promise<void> {
  await requireSession();
  return data.markContactMessageRead(id, read);
}

export async function deleteContactMessage(id: string): Promise<void> {
  await requireSession();
  return data.deleteContactMessage(id);
}
