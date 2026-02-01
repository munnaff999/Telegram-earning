// js/session.js
const user = localStorage.getItem("user_email");
if (!user) {
  window.location.href = "login.html";
}
