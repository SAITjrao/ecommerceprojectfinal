import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${q}%`);
    if (error) throw new Error(error.message);
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}