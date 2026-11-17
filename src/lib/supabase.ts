import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  console.warn("[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — DB features disabled.");
}

export const supabase = url && anonKey
  ? createClient<Database>(url, anonKey, {
      auth: { persistSession: false },
    })
  : null;

export const supabaseReady = Boolean(supabase);
