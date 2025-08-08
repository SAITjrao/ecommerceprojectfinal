import { supabase } from '@/lib/supabaseClient';

export async function fetchProducts(page, pageSize, search = '') {
  const params = new URLSearchParams({
    page,
    pageSize,
  });
  if (search) params.append('search', search);

  const res = await fetch(`/api/products?${params.toString()}`);
  const data = await res.json();
  return {
    data: Array.isArray(data.products) ? data.products : [],
    count: typeof data.total === "number" ? data.total : 0,
  };
}