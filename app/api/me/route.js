import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = JSON.parse(session.value);

  // Fetch businessType and preferences from the database
  const { data, error } = await supabase
    .from("users")
    .select("business_type, preferences")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      ...user,
      businessType: data.business_type,
      preferences: data.preferences,
    },
  });
}
