// Load saved theme + language
document.addEventListener("DOMContentLoaded", async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("theme, language")
    .eq("id", user.id)
    .single();

  // Set theme
  if (profile?.theme === "dark") document.body.classList.add("dark-theme");
  else document.body.classList.remove("dark-theme");

  // Set language selector
  if (profile?.language) {
    const langSelect = document.getElementById("languageSelector");
    if (langSelect) langSelect.value = profile.language;
  }
});

// Theme toggle function
async function toggleTheme() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const isDark = document.body.classList.toggle("dark-theme");
  await supabase
    .from("profiles")
    .update({ theme: isDark ? "dark" : "light" })
    .eq("id", user.id);

  showToast("Theme changed!", "success");
}

// Change language function
async function changeLanguage(lang) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("profiles")
    .update({ language: lang })
    .eq("id", user.id);

  showToast("Language changed!", "success");
}

// Toast system
function showToast(message, type = "info") {
  let toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  document.body.appendChild(toast);
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
