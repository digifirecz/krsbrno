'use server';

import * as data from '@/lib/data/contactMessages';
import type { ContactMessage, ContactMessageInput } from '@/lib/contactMessages';
import { requireSession } from '@/lib/auth/session';
import { withAction } from '@/lib/sentryAction';

export const getContactMessages = withAction('contactMessages.getContactMessages', async (): Promise<ContactMessage[]> => {
  await requireSession();
  return data.getContactMessages();
});

// Public — this is the contact form submit itself, must stay open to visitors.
export const createContactMessage = withAction('contactMessages.createContactMessage', async (input: ContactMessageInput): Promise<string> => {
  return data.createContactMessage(input);
});

export const markContactMessageRead = withAction('contactMessages.markContactMessageRead', async (id: string, read: boolean): Promise<void> => {
  await requireSession();
  return data.markContactMessageRead(id, read);
});

export const deleteContactMessage = withAction('contactMessages.deleteContactMessage', async (id: string): Promise<void> => {
  await requireSession();
  return data.deleteContactMessage(id);
});
