// js/init.js
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_KEY = "PUBLIC_ANON_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
