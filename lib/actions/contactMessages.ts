'use server';

import * as data from '@/lib/data/contactMessages';
import type { ContactMessage, ContactMessageInput } from '@/lib/contactMessages';

export async function getContactMessages(): Promise<ContactMessage[]> {
  return data.getContactMessages();
}

export async function createContactMessage(input: ContactMessageInput): Promise<string> {
  return data.createContactMessage(input);
}

export async function markContactMessageRead(id: string, read: boolean): Promise<void> {
  return data.markContactMessageRead(id, read);
}

export async function deleteContactMessage(id: string): Promise<void> {
  return data.deleteContactMessage(id);
}
