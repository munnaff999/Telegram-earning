(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    location.href = "login.html";
    return;
  }

  const { data } = await supabase
    .from("users")
    .select("balance")
    .eq("id", user.id)
    .single();

  document.getElementById("balance").innerText =
    "₹ " + (data?.balance || 0);
})();
