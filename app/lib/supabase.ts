import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

/** Anon client — for public reads (invitation pages, RSVP matching) */
export function createClient() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  }
  return supabaseCreateClient(url, anonKey);
}

/** Service client — for server-side writes (bypasses RLS) */
export function createServiceClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return supabaseCreateClient(url, serviceKey);
}
