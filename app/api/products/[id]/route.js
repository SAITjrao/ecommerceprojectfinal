import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getAccessToken(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const accessTokenMatch = cookieHeader.match(/access_token=([^;]+)/);
  return accessTokenMatch ? accessTokenMatch[1] : null;
}

export async function PATCH(request, context) {
  const { id } = await context.params;
  const body = await request.json();
  const access_token = getAccessToken(request);

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${access_token}` } }
  });

  try {
    const { data, error } = await supabase
      .from("products")
      .update(body)
      .eq("id", id)
      .select();
    if (error) throw new Error(error.message);
    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, context) {
  const { id } = context.params;
  const access_token = getAccessToken(request);

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${access_token}` } }
  });

  try {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return Response.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}