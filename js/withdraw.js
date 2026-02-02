<script>
async function requestWithdraw() {
  const telegram_id = localStorage.getItem("telegram_id");
  const amount = parseInt(document.getElementById("amount").value);
  const bank_name = document.getElementById("bank_name").value;
  const account_no = document.getElementById("account_no").value;
  const ifsc = document.getElementById("ifsc").value;
  const holder = document.getElementById("holder").value;

  if (!telegram_id) {
    alert("Login required");
    return;
  }

  if (amount < 100) {
    alert("❌ Minimum withdrawal is 100 coins");
    return;
  }

  // 1️⃣ Get user
  const { data: user } = await supabase
    .from("users")
    .select("id, balance")
    .eq("telegram_id", telegram_id)
    .single();

  if (!user || user.balance < amount) {
    alert("❌ Insufficient balance");
    return;
  }

  // 2️⃣ Insert withdrawal request
  const { error } = await supabase.from("withdrawals").insert({
    user_id: user.id,
    telegram_id: telegram_id,
    amount: amount,
    bank_name: bank_name,
    account_no: account_no,
    ifsc: ifsc,
    account_holder: holder,
    status: "pending"
  });

  if (error) {
    alert("Withdraw failed");
    return;
  }

  // 3️⃣ Deduct balance
  await supabase
    .from("users")
    .update({ balance: user.balance - amount })
    .eq("id", user.id);

  // 4️⃣ Balance log
  await supabase.from("balance_logs").insert({
    user_id: user.id,
    telegram_id: telegram_id,
    amount: amount,
    type: "debit",
    reason: "withdraw_request"
  });

  // 5️⃣ EMAIL ALERT (via Supabase function / EmailJS webhook)
  fetch("https://YOUR_PROJECT_ID.supabase.co/functions/v1/withdraw-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      telegram_id,
      amount,
      bank_name,
      account_no,
      ifsc,
      holder
    })
  });

  alert("✅ Withdrawal Requested Successfully");
}
</script>
