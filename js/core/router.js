export async function loadPage(page) {
  const app = document.getElementById('app');

  try {
    const res = await fetch(`./pages/${page}.html`);
    const html = await res.text();
    app.innerHTML = html;
  } catch (e) {
    app.innerHTML = '<h3>Page load error</h3>';
    console.error(e);
  }
}
import { loadUserBalance } from '../modules/balance.js';

loadUserBalance();
