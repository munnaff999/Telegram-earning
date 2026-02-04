let currentBalance = 0;

document.addEventListener("DOMContentLoaded", loadHome);

async function loadHome()
async function loadBell() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const badge = document.getElementById("notifCount");
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}
{
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "../auth/login.html";
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", user.id)
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  currentBalance = data.balance || 0;
  animateBalance(currentBalance);

  document.getElementById("balanceCard").classList.remove("skeleton");
}

function animateBalance(amount) {
  const el = document.getElementById("balance");
  let start = 0;
  const duration = 800;
  const step = Math.max(1, amount / (duration / 16));

  const interval = setInterval(() => {
    start += step;
    if (start >= amount) {
      el.textContent = amount.toFixed(0);
      clearInterval(interval);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

async function completeTask(value) {
  const { data: { user } } = await supabase.auth.getUser();

  const newBalance = currentBalance + value;

  const { error } = await supabase
    .from("profiles")
    .update({ balance: newBalance })
    .eq("id", user.id);

  if (error) {
    alert(error.message);
  } else {
    currentBalance = newBalance;
    animateBalance(currentBalance);
    toast("₹1 added successfully!");
  }
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

