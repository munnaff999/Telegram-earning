import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://YOUR.supabase.co";
const SUPABASE_KEY = "PUBLIC_ANON_KEY";

window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
