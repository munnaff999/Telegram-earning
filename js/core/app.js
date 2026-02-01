import { initRouter } from "./router.js";
import { initTelegram } from "./telegram.js";

document.addEventListener("DOMContentLoaded", () => {
  initTelegram();
  initRouter();
});

import { loadUserBalance } from '../modules/balance.js';

document.addEventListener('DOMContentLoaded', () => {
  loadUserBalance();
});
