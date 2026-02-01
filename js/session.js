function checkSessionAndRedirect() {
  const user = localStorage.getItem("user");

  if (user) {
    window.location.href = "pages/home.html";
  } else {
    window.location.href = "login.html";
  }
}

function requireLogin() {
  const user = localStorage.getItem("user");
  if (!user) {
    window.location.href = "../login.html";
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "../login.html";
}
