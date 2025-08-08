import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  // ...other params...

  let query = supabase.from("products").select("*");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  try {
    const { data: products, error, count } = await query;
    if (error) throw new Error(error.message);
    return Response.json({ success: true, products: products || [], total: count || 0 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const body = await request.json();

  const { data, error } = await supabase
    .from("products")
    .insert([body])
    .select();

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
  return Response.json({ success: true, product: data[0] });
}