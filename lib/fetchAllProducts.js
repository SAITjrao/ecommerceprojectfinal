import { supabase } from '@/lib/supabaseClient';

export async function fetchProducts(page, pageSize) {
  // Get total count
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (countError) throw countError;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { data, count };
}