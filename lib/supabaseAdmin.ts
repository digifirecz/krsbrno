import { createClient } from '@supabase/supabase-js';

// Server-only. Uses the service-role key, which bypasses Supabase's row-level
// security / storage policies entirely — never import this from a 'use client'
// file or otherwise let this key reach the browser. All access control (who's
// allowed to upload/delete what) is enforced in app/api/upload/route.ts before
// this client is ever touched, the same way the old local-disk uploader worked.
const globalForSupabase = globalThis as unknown as { _supabaseAdmin?: ReturnType<typeof createClient> };

export const supabaseAdmin =
  globalForSupabase._supabaseAdmin ??
  createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
    auth: { persistSession: false },
  });

if (process.env.NODE_ENV !== 'production') globalForSupabase._supabaseAdmin = supabaseAdmin;
