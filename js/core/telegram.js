export function initTelegram() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    console.log("Telegram user:", Telegram.WebApp.initDataUnsafe.user);
  }
}

import { supabase } from "./supabase.js";

export async function initTelegram() {
  if (!window.Telegram?.WebApp) return;

  const tgUser = Telegram.WebApp.initDataUnsafe.user;
  if (!tgUser) return;

  const telegramId = tgUser.id.toString();

  // check profile
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (data) {
    // already exists → magic login
    await supabase.auth.signInWithOtp({
      email: data.email
    });
  } else {
    // create new user
    const email = `${telegramId}@telegram.xdevil`;

    const { data: auth } = await supabase.auth.signUp({
      email,
      password: telegramId
    });

    await supabase.from("profiles").update({
      telegram_id: telegramId,
      name: tgUser.first_name
    }).eq("id", auth.user.id);
  }
}
