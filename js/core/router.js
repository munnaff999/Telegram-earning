export function initRouter() {
  loadPage("home");

  window.addEventListener("hashchange", () => {
    const page = location.hash.replace("#/", "") || "home";
    loadPage(page);
  });
}

async function loadPage(page) {
  const res = await fetch(`/pages/${page}.html`);
  document.getElementById("app").innerHTML = await res.text();
}
import { loadUserBalance } from '../modules/balance.js';

loadUserBalance();
