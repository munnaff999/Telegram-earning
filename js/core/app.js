import { loadPage } from './router.js';

window.addEventListener('DOMContentLoaded', () => {
  loadPage('home');

  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      loadPage(btn.dataset.page);
    });
  });
});
