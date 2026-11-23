import { NextResponse } from "next/server";

import { DASHBOARD_COOKIE } from "@/lib/dashboard/auth";
import { assertSameOrigin, errorResponse } from "@/lib/dashboard/guard";

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(DASHBOARD_COOKIE, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (err) {
    return errorResponse(err);
  }
}
