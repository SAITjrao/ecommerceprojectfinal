import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export async function GET(request, { params }) {
  try {
    const { user_id } = await params;
    if (!user_id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("users")
      .select("id, fname, lname")
      .eq("id", user_id)
      .single();

    if (error || !data) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}