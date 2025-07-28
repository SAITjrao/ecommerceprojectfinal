import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Invalid input." }), {
        status: 400,
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return new Response(JSON.stringify({ error: "Login failed." }), {
        status: 401,
      });
    }

    return new Response(JSON.stringify({ success: true, user: data.user }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in login API:", error);
    return new Response(JSON.stringify({ error: "Login failed." }), {
      status: 500,
    });
  }
}
