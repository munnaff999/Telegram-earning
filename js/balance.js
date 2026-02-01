// js/balance.js
function loadBalance() {
  const bal = localStorage.getItem("balance") || "0";
  const el = document.getElementById("user-balance");
  if (el) el.innerText = "₹" + bal;
}
loadBalance();
