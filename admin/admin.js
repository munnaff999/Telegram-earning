async function loadWithdraws() {
  const { data } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("status", "pending");

  document.getElementById("list").innerHTML =
    data.map(w =>
      `<p>${w.user_id} ₹${w.amount}
      <button onclick="approve(${w.id})">Approve</button></p>`
    ).join("");
}

async function approve(id) {
  await supabase
    .from("withdrawals")
    .update({ status: "approved" })
    .eq("id", id);

  alert("Approved");
  loadWithdraws();
}

loadWithdraws();
