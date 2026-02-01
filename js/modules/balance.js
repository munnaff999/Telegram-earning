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
