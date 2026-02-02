async function approveWithdraw(id) {
  await supabase
    .from("withdrawals")
    .update({ status: "approved" })
    .eq("id", id);

  alert("✅ Withdrawal Approved");
}

async function rejectWithdraw(id, user_id, amount) {
  // refund balance
  const { data: user } = await supabase
    .from("users")
    .select("balance")
    .eq("id", user_id)
    .single();

  await supabase
    .from("users")
    .update({ balance: user.balance + amount })
    .eq("id", user_id);

  await supabase
    .from("withdrawals")
    .update({ status: "rejected" })
    .eq("id", id);

  await supabase.from("balance_logs").insert({
    user_id,
    amount,
    type: "credit",
    reason: "withdraw_reject_refund"
  });

  alert("❌ Withdraw Rejected & Refunded");
}
