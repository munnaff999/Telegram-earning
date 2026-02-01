const SUPABASE_URL = "https://sqgmfbjllqdbzyfozufy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ21mYmpsbHFkYnp5Zm96dWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzc4MDgsImV4cCI6MjA4NDcxMzgwOH0.mLzb9BozHyXEG5un9zEfIHIOUhDf0x9iJq6xVh1lIQY";

const supabase = supabaseJs.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// DEMO USER (Telegram / Login later)
const USER_ID = "demo_user_1";
