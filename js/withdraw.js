function submitWithdraw() {
  const amount = parseInt(document.getElementById("amount").value);
  const method = document.getElementById("method").value;

  let balance = parseInt(localStorage.getItem("balance") || 0);

  if (amount < 100) {
    alert("Minimum withdrawal ₹100");
    return;
  }

  if (amount > balance) {
    alert("Insufficient balance");
    return;
  }

  const req = {
    id: Date.now(),
    amount,
    method,
    status: "pending",
    time: new Date().toLocaleString()
  };

  let requests = JSON.parse(localStorage.getItem("withdraw_requests") || "[]");
  requests.push(req);

  localStorage.setItem("withdraw_requests", JSON.stringify(requests));

  alert("Withdrawal request sent");
}
