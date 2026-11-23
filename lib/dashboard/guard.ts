import { cookies } from "next/headers";

import { DASHBOARD_COOKIE, verifySession } from "./auth";

export class AuthError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AuthError";
  }
}

export class CsrfError extends Error {
  constructor() {
    super("Bad origin");
    this.name = "CsrfError";
  }
}

/** Require a valid dashboard session; call at the top of every dashboard route handler. */
export async function requireAuth(): Promise<void> {
  const store = await cookies();
  if (!verifySession(store.get(DASHBOARD_COOKIE)?.value)) {
    throw new AuthError();
  }
}

/**
 * Mutating routes only: reject cross-site posts. SameSite=Lax already blocks
 * cross-site cookie sends; this adds an explicit Origin/Host (or Fetch-Site)
 * check so a missing Origin header can not silently bypass intent.
 */
export function assertSameOrigin(req: Request): void {
  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("host");
    try {
      if (new URL(origin).host !== host) throw new CsrfError();
    } catch {
      throw new CsrfError();
    }
    return;
  }
  const site = req.headers.get("sec-fetch-site");
  if (site && !["same-origin", "same-site", "none"].includes(site)) {
    throw new CsrfError();
  }
}

export function errorResponse(err: unknown): Response {
  if (err instanceof AuthError) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (err instanceof CsrfError) {
    return Response.json({ error: "Bad origin" }, { status: 403 });
  }
  console.error(err);
  return Response.json({ error: "Server error" }, { status: 500 });
}
