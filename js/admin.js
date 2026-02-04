const ADMIN_EMAILS = ["admin@xdevilearning.com"];

document.addEventListener("DOMContentLoaded", initAdmin);

async function initAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    alert("Unauthorized");
    return location.href = "../app/home.html";
  }
  loadWithdraws();
}

async function loadWithdraws() {
  const { data, error } = await supabase
    .from("withdraws")
    .select("id, user_id, amount, method, details, status, created_at")
    .order("created_at", { ascending: false });

  if (error) return alert(error.message);

  const list = document.getElementById("withdrawList");
  list.innerHTML = "";

  let pending = 0, totalPaid = 0;

  data.forEach(w => {
    if (w.status === "Pending") pending++;
    if (w.status === "Approved") totalPaid += Number(w.amount);

    list.innerHTML += `
      <div class="admin-card">
        <div>
          <b>₹${w.amount}</b> • ${w.method}<br/>
          <small>${w.details}</small><br/>
          <small>Status: ${w.status}</small>
        </div>
        ${w.status === "Pending" ? `
          <div class="actions">
            <button onclick="approve('${w.id}', '${w.user_id}', ${w.amount})">Approve</button>
            <button class="danger" onclick="reject('${w.id}')">Reject</button>
          </div>` : ``}
      </div>
    `;
  });

  document.getElementById("pendingCount").textContent = pending;
  document.getElementById("totalPaid").textContent = totalPaid;
}

async function approve(id, userId, amount) {
  if (!confirm("Approve this withdraw?")) return;

  // 1) deduct balance
  const { data: prof } = await supabase
    .from("profiles")
    .select("balance")
    .eq("id", userId)
    .single();

  if (prof.balance < amount) return alert("User balance insufficient");

  await supabase.from("profiles")
    .update({ balance: prof.balance - amount })
    .eq("id", userId);

  // 2) update withdraw status
  await supabase.from("withdraws")
    .update({ status: "Approved" })
    .eq("id", id);

  // 3) auto notify (in-app)
  await notify(userId, `Withdraw ₹${amount} approved`);

  loadWithdraws();
}

async function reject(id) {
  await supabase.from("withdraws")
    .update({ status: "Rejected" })
    .eq("id", id);

  // auto notify user
  const { data } = await supabase.from("withdraws").select("user_id, amount").eq("id", id).single();
  await notify(data.user_id, `Withdraw ₹${data.amount} rejected`);

  loadWithdraws();
}

async function notify(userId, message) {
  await supabase.from("notifications").insert([{
    user_id: userId,
    message
  }]);
}
