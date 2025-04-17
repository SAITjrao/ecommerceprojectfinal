import { getUser } from "../../../scripts/testDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const user = await getUser(email, password);

    const sessionPayload = {
      id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    const res = NextResponse.json({ success: true, user: sessionPayload });

    res.cookies.set("session", JSON.stringify(sessionPayload), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 401 }
    );
  }
}
