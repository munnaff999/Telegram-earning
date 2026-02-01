export const state = {
  user: {
    id: 'demo-user',
    balance: 0
  }
};

export function addBalance(amount) {
  state.user.balance += amount;
  updateBalanceUI();
}

export function updateBalanceUI() {
  const el = document.getElementById('user-balance');
  if (el) el.innerText = state.user.balance;
}
