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
