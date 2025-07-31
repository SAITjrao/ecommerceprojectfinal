import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getUser } from '@/lib/getUser';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  const { email, password } = await request.json();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ success: false, message: error.message });
  }

  const { data: userData, error: userError } = await getUser(data.user.email);

  if (userError || !userData) {
    return NextResponse.json({ success: false, message: "User profile not found." });
  }

  const name = `${userData.fname} ${userData.lname}`;

  return NextResponse.json({
    success: true,
    user: {
      name,
      email: data.user.email,
    },
  });
}