async function earn() {
  await supabase.rpc("increment_balance", {
    uid: USER_ID,
    amount: 2
  });

  alert("₹2 Added!");
}
