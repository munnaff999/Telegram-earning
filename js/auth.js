let tg = window.Telegram.WebApp;
tg.expand();

const telegramUser = tg.initDataUnsafe?.user;

if (!telegramUser) {
  alert("Telegram login failed");
}

localStorage.setItem("telegram_id", telegramUser.id);
localStorage.setItem("name", telegramUser.first_name);

async function ensureUser() {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramUser.id)
    .single();

  if (!data) {
    await supabase.from("users").insert({
      telegram_id: telegramUser.id,
      name: telegramUser.first_name,
      balance: 0
    });
  }
}

ensureUser();
