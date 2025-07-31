import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  const { email, password, firstName, lastName } = await request.json();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { firstName, lastName },
    },
  });
  if (error) {
    return NextResponse.json({ success: false, message: error.message });
  }

  const userId = data.user?.id;
  if (userId) {
    const { error: insertError } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email,
        password_hash: password,
        fname: firstName,
        lname: lastName,
      }]);
    if (insertError) {
      return NextResponse.json({ success: false, message: insertError.message });
    }
  }

  return NextResponse.json({ success: true });
}
