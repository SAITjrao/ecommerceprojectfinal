import { supabase } from '@/lib/supabaseClient';

export async function getUser(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  return { data, error };
}