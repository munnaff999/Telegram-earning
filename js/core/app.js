import { loadPage } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  loadPage('home');
});

import { loadUserBalance } from '../modules/balance.js';

document.addEventListener('DOMContentLoaded', () => {
  loadUserBalance();
});
