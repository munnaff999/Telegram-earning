// js/auth.js
function login() {
  const email = document.getElementById("email").value;

  if (!email) {
    alert("Email required");
    return;
  }

  localStorage.setItem("user_email", email);
  if (!localStorage.getItem("balance")) {
    localStorage.setItem("balance", "0");
  }

  window.location.href = "index.html";
}
function loginTelegram() {
  // Dummy Telegram user (abhi)
  const telegramUser = {
    id: "tg_" + Date.now(),
    name: "Telegram User",
    balance: 0,
    joined: new Date().toISOString()
  };

  localStorage.setItem("user", JSON.stringify(telegramUser));
  localStorage.setItem("balance", 0);

  window.location.href = "pages/home.html";
}
