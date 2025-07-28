import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { businessType, preferences } = await req.json();

    if (!businessType || !preferences || preferences.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid input." }), {
        status: 400,
      });
    }

    // Ensure preferences column exists
    const { error: columnError } = await supabase.rpc("ensure_preferences_column");
    if (columnError) {
      console.error("Error ensuring preferences column:", columnError);
      return new Response(JSON.stringify({ error: "Database error." }), {
        status: 500,
      });
    }

    const { data, error } = await supabase.from("users").insert([
      {
        business_type: businessType,
        preferences,
      },
    ]);

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ message: "Signup successful!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in signup API:", error);
    return new Response(JSON.stringify({ error: "Signup failed." }), {
      status: 500,
    });
  }
}
