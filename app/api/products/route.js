import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*");
    if (error) throw new Error(error.message);
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}