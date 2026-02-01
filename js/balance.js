// js/balance.js
function loadBalance() {
  const bal = localStorage.getItem("balance") || "0";
  const el = document.getElementById("user-balance");
  if (el) el.innerText = "₹" + bal;
}
loadBalance();
function loadBalance() {
  let bal = localStorage.getItem("balance");
  if (!bal) {
    bal = 0;
    localStorage.setItem("balance", 0);
  }

  const el = document.getElementById("user-balance");
  if (!el) return;

  el.classList.add("pulse");
  el.innerText = "₹" + bal;

  setTimeout(() => el.classList.remove("pulse"), 300);
}
