const ADMIN_EMAIL = "youradmin@gmail.com";

(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    alert("Access denied");
    location.href = "/";
    return;
  }

  const { data } = await supabase
    .from("users")
    .select("email,balance");

  document.getElementById("users").innerHTML =
    data.map(u => `<p>${u.email} - ₹${u.balance}</p>`).join("");
})();
