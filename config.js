const SUPABASE_URL = "https://sqgmfbjllqdbzyfozufy.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_ANON_KEY_HERE"; // anon key only

const ADMIN_TELEGRAM_ID = 123456789; // apna telegram numeric ID

const supabase = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// TEMP TELEGRAM ID (jab tak real TG connect na ho)
const TELEGRAM_USER_ID = 111111;
const TELEGRAM_USERNAME = "test_user";