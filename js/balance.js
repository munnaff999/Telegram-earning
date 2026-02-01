async function loadBalance() {
  const telegram_id = localStorage.getItem("telegram_id");

  const { data } = await supabase
    .from("users")
    .select("balance")
    .eq("telegram_id", telegram_id)
    .single();

  document.getElementById("balance").innerText = data.balance;
}

loadBalance();
