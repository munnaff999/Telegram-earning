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
export async function loadTasks() {
  document.getElementById("tasks-list").innerHTML = `
    <div class="task">Install App – ₹5</div>
    <div class="task">Watch Ad – ₹1</div>
  `;
}
