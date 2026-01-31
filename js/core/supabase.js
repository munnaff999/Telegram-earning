import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://sqgmfbjllqdbzyfozufy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZ21mYmpsbHFkYnp5Zm96dWZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMzc4MDgsImV4cCI6MjA4NDcxMzgwOH0.mLzb9BozHyXEG5un9zEfIHIOUhDf0x9iJq6xVh1lIQY"
);
