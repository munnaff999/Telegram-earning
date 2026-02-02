<script>
async function completeOffer(offer_id) {
  const telegram_id = localStorage.getItem("telegram_id");

  if (!telegram_id) {
    alert("Telegram login required");
    return;
  }

  // 1️⃣ Check already completed or not
  const { data: existing } = await supabase
    .from("offer_completions")
    .select("id")
    .eq("telegram_id", telegram_id)
    .eq("offer_id", offer_id)
    .maybeSingle();

  if (existing) {
    alert("Offer already completed");
    return;
  }

  // 2️⃣ Get current balance
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("id, balance")
    .eq("telegram_id", telegram_id)
    .single();

  if (userErr || !user) {
    alert("User not found");
    return;
  }

  const newBalance = user.balance + 1;

  // 3️⃣ Insert offer completion
  const { error: offerErr } = await supabase
    .from("offer_completions")
    .insert({
      user_id: user.id,
      telegram_id: telegram_id,
      offer_id: offer_id,
      reward: 1,
      status: "completed"
    });

  if (offerErr) {
    alert("Offer failed");
    return;
  }

  // 4️⃣ Update balance
  const { error: balErr } = await supabase
    .from("users")
    .update({ balance: newBalance })
    .eq("id", user.id);

  if (balErr) {
    alert("Balance update failed");
    return;
  }

  // 5️⃣ Balance log (admin + audit)
  await supabase.from("balance_logs").insert({
    user_id: user.id,
    telegram_id: telegram_id,
    amount: 1,
    type: "credit",
    reason: "offer_install"
  });

  alert("✅ 1 Coin Added Successfully");
}
</script>
