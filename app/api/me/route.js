import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const user = JSON.parse(session.value);
  return NextResponse.json({ authenticated: true, user });
}
