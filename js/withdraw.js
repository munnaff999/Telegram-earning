async function withdraw() {
  const telegram_id = localStorage.getItem("telegram_id");
  const amount = parseInt(document.getElementById("amount").value);

  if (amount < 100) {
    alert("Minimum withdrawal 100");
    return;
  }

  await supabase.from("withdraw_requests").insert({
    telegram_id,
    amount,
    bank_name: bank.value,
    account_no: account.value,
    ifsc: ifsc.value,
    status: "pending"
  });

  window.location.href =
    "mailto:xdevilearning@gmail.com?subject=New Withdraw Request&body=Telegram ID: " +
    telegram_id + "%0AAmount: " + amount;

  alert("Withdraw request submitted");
}
