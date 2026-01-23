if (TELEGRAM_USER_ID !== ADMIN_TELEGRAM_ID) {
  document.body.innerHTML = "Access Denied";
}

async function loadPending() {
  const { data } = await supabase
    .from("offer_completions")
    .select("*, offers(reward)")
    .eq("status", "pending");

  const box = document.getElementById("pendingOffers");
  box.innerHTML = "";

  data.forEach(o => {
    box.innerHTML += `
      <div>
        User ${o.telegram_user_id} - ₹${o.offers.reward}
        <button onclick="approve('${o.id}',${o.telegram_user_id},${o.offers.reward})">Approve</button>
      </div>`;
  });
}

async function approve(id, uid, reward) {
  await supabase.from("offer_completions")
    .update({ status: "approved" })
    .eq("id", id);

  const { data } = await supabase
    .from("tg_users")
    .select("balance")
    .eq("telegram_user_id", uid)
    .single();

  await supabase.from("tg_users")
    .update({ balance: data.balance + reward })
    .eq("telegram_user_id", uid);

  loadPending();
}

loadPending();