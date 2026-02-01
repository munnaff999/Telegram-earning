import { supabase } from '../core/supabase.js';

export async function addBalance(amount, source, ref) {
  const user = (await supabase.auth.getUser()).data.user;

  return await supabase.rpc('add_balance', {
    p_user_id: user.id,
    p_amount: amount,
    p_source: source,
    p_ref: ref
  });
}
import { supabase } from '../core/supabase.js';

export async function loadUserBalance() {
  const { data, error } = await supabase
    .from('users')
    .select('balance')
    .single();

  if (error) {
    console.error('Balance load error', error);
    return;
  }

  const el = document.getElementById('user-balance');
  if (el) {
    el.innerText = data.balance;
  }
}
