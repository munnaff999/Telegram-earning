async function initUser() {
  await supabase.from("tg_users").upsert({
    telegram_user_id: TELEGRAM_USER_ID,
    username: TELEGRAM_USERNAME
  });
}

async function loadBalance() {
  const { data } = await supabase
    .from("tg_users")
    .select("balance")
    .eq("telegram_user_id", TELEGRAM_USER_ID)
    .single();

  document.getElementById("balance").innerText = data.balance;
}

async function loadOffers() {
  const { data } = await supabase
    .from("offers")
    .select("*")
    .eq("status", "active");

  const box = document.getElementById("offers");
  box.innerHTML = "";

  data.forEach(o => {
    box.innerHTML += `
      <div class="offer">
        <h4>${o.title}</h4>
        <p>Reward: ₹${o.reward}</p>
        <button onclick="doOffer('${o.id}','${o.external_link}')">Install</button>
      </div>`;
  });
}

async function doOffer(offerId, link) {
  await supabase.from("offer_completions").insert({
    telegram_user_id: TELEGRAM_USER_ID,
    offer_id: offerId
  });
  window.open(link, "_blank");
}

initUser();
loadBalance();
loadOffers();