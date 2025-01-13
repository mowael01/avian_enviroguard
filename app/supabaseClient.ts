import { createClient } from "@supabase/supabase-js";

// Replace these with your actual Supabase project URL and API key
const SUPABASE_URL = "https://your-project-url.supabase.co";
const SUPABASE_KEY = "your-supabase-anon-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
