import { supabase } from '../core/supabase.js';

export async function initBalance() {
  const balanceEl = document.getElementById('user-balance');

  if (!balanceEl) return;

  const { data, error } = await supabase
    .from('users')
    .select('balance')
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    balanceEl.innerText = '0';
    return;
  }

  balanceEl.innerText = data.balance;
}
