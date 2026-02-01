async function loadBalance() {
  const { data } = await supabase
    .from("users")
    .select("balance")
    .eq("id", USER_ID)
    .single();

  document.getElementById("balance").innerText =
    data?.balance || 0;
}

loadBalance();
