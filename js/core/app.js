import { loadPage } from './router.js';

window.addEventListener('DOMContentLoaded', () => {
  loadPage('home');

  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      loadPage(btn.dataset.page);
    });
  });
});
<button data-page="tasks">📝 Tasks</button>
<button data-page="offers">🔥 Offers</button>
