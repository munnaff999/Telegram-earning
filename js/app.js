// MUST be on top
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/app.config.js";

// Supabase init
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
window.supabaseClient = supabase;

// Telegram WebApp init (safe)
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.expand();
}

// Page loader
function loadPage(page) {
  fetch(`pages/${page}.html`)
    .then(res => {
      if (!res.ok) throw new Error("Page not found");
      return res.text();
    })
    .then(html => {
      document.getElementById("app").innerHTML = html;
    })
    .catch(err => {
      document.getElementById("app").innerHTML = `
        <div style="padding:20px;color:red;">
          Page load error ❌
        </div>
      `;
      console.error(err);
    });
}

// Default page
document.addEventListener("DOMContentLoaded", () => {
  loadPage("home");
});

// Ad trigger
window.addEventListener("load", () => {
  setTimeout(() => {
    if (typeof showInAppAd === "function") {
      showInAppAd();
    }
  }, 30000);
});
