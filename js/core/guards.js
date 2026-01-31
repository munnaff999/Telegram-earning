import { supabase } from "./supabase.js";

export async function requireAuth() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    location.hash = "#/login";
    throw "Not logged in";
  }
}
