/**
 * Supabase client — full schema lives in /supabase/schema.sql.
 *
 * SETUP: add these env vars in Vercel (Settings → Environment Variables)
 * and in a local .env file:
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJ...
 *
 * The app degrades gracefully when unconfigured: auth runs in local
 * demo mode and resumes persist to localStorage, so nothing breaks
 * before credentials are wired in.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  url && anonKey && url.startsWith("https://") ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = supabase !== null;
