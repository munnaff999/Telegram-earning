import { addBalance } from '../core/state.js';

export function init() {
  document.querySelectorAll('[data-reward]').forEach(btn => {
    btn.addEventListener('click', () => {
      const reward = Number(btn.dataset.reward);
      addBalance(reward);
      btn.disabled = true;
      btn.innerText = 'Completed ✅';
    });
  });
}
