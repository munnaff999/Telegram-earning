import { loadPage } from './router.js';
import { initBalance } from '../modules/balance.js';

window.addEventListener('DOMContentLoaded', async () => {
  await loadPage('home');
  initBalance();
});
