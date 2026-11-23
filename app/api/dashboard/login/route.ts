import { NextResponse } from "next/server";

import {
  checkPassword,
  dashboardConfigured,
  signSession,
  DASHBOARD_COOKIE,
  SESSION_COOKIE_OPTIONS,
} from "@/lib/dashboard/auth";
import { assertSameOrigin, errorResponse } from "@/lib/dashboard/guard";

// Best-effort throttle for password guessing (per instance).
const attempts = new Map<string, { count: number; resetAt: number }>();

function throttled(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 10;
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    if (!dashboardConfigured()) {
      return Response.json(
        { error: "Dashboard is not configured yet." },
        { status: 503 }
      );
    }
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (throttled(ip)) {
      return Response.json(
        { error: "Too many attempts. Try again in a few minutes." },
        { status: 429 }
      );
    }
    const body = (await req.json().catch(() => null)) as {
      password?: string;
    } | null;
    // Small constant delay to slow guessing.
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!body?.password || !checkPassword(body.password)) {
      return Response.json({ error: "Wrong password." }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(DASHBOARD_COOKIE, signSession(), SESSION_COOKIE_OPTIONS);
    return res;
  } catch (err) {
    return errorResponse(err);
  }
}
