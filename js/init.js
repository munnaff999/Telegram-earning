const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_KEY = "PUBLIC_ANON_KEY";

const supabase = supabaseJs.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// DEMO USER (Telegram / Login later)
const USER_ID = "demo_user_1";
