function loadWithdrawals() {
  const list = document.getElementById("withdraw-list");
  const requests = JSON.parse(localStorage.getItem("withdraw_requests") || "[]");

  list.innerHTML = "";

  requests.forEach((r, i) => {
    list.innerHTML += `
      <div>
        ₹${r.amount} | ${r.method} | ${r.status}
        <button onclick="approve(${i})">Approve</button>
        <hr>
      </div>
    `;
  });
}

function approve(index) {
  let requests = JSON.parse(localStorage.getItem("withdraw_requests"));
  requests[index].status = "approved";

  let bal = parseInt(localStorage.getItem("balance"));
  bal -= requests[index].amount;

  localStorage.setItem("balance", bal);
  localStorage.setItem("withdraw_requests", JSON.stringify(requests));

  loadWithdrawals();
}
