import { supabase } from "./supabase.js";

export async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) alert(error.message);
  else alert("Check email for verification");
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) alert(error.message);
  else location.hash = "#/home";
}

export async function logout() {
  await supabase.auth.signOut();
  location.hash = "#/login";
}
