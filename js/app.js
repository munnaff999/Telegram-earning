// Telegram WebApp Init
const tg = window.Telegram.WebApp;
tg.expand();

// Page loader function
function loadPage(page) {
  fetch(`pages/${page}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Page not found");
      }
      return response.text();
    })
    .then(data => {
      document.getElementById("app").innerHTML = data;
    })
    .catch(error => {
      document.getElementById("app").innerHTML = `
        <div style="padding:20px;color:red;">
          Page load error ❌
        </div>
      `;
      console.error(error);
    });
}

// Default page
document.addEventListener("DOMContentLoaded", () => {
  loadPage("home");
});

window.addEventListener("load", () => {
  setTimeout(() => {
    if (typeof showInAppAd === "function") {
      showInAppAd();
    }
  }, 30000); // 30 sec baad
});
