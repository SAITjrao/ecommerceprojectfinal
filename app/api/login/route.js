import { NextResponse, userAgent } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUser } from '@/lib/getUser';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message });
    }

    const { data: userData, error: userError } = await getUser(data.user.email);

    if (userError || !userData) {
      return NextResponse.json({ success: false, message: "User profile not found." });
    }

    function capitalize(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // get user's name
    const name = `${capitalize(userData.fname)} ${capitalize(userData.lname)}`;

    // Create user object with ID
    const user = {
      id: data.user.id,
      name,
      email: data.user.email,
      access_token: data.session.access_token,
      is_admin: userData.is_admin, // <-- Add this line
    };

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set("access_token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
}