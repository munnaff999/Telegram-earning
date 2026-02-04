let userBalance = 0;

document.addEventListener("DOMContentLoaded", loadWithdraw);

async function loadWithdraw() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return location.href = "../auth/login.html";

  const { data } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  userBalance = data.balance || 0;
  document.getElementById("balance").textContent = userBalance;

  loadHistory(user.id);
}

async function requestWithdraw() {
  const amount = Number(document.getElementById("amount").value);
  const method = document.getElementById("method").value;
  const details = document.getElementById("details").value.trim();

  if (amount < 50) return toast("Minimum withdraw ₹50");
  if (amount > userBalance) return toast("Insufficient balance");
  if (!details) return toast("Enter payment details");

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("withdraws").insert([{
    user_id: user.id,
    amount,
    method,
    details,
    status: "Pending"
  }]);

  if (error) toast(error.message);
  else {
    toast("Withdraw request submitted");
    document.getElementById("amount").value = "";
  }
}

async function loadHistory(uid) {
  const { data } = await supabase
    .from("withdraws")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: false });

  const list = document.getElementById("historyList");
  list.innerHTML = "";

  data.forEach(w => {
    list.innerHTML += `
      <div class="history-item">
        ₹${w.amount} • ${w.status}
      </div>
    `;
  });
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}
