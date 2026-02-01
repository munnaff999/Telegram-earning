async function completeOffer() {
  const telegram_id = localStorage.getItem("telegram_id");

  const { data } = await supabase
    .from("users")
    .select("balance")
    .eq("telegram_id", telegram_id)
    .single();

  await supabase
    .from("users")
    .update({ balance: data.balance + 1 })
    .eq("telegram_id", telegram_id);

  alert("1 Coin Added");
}
