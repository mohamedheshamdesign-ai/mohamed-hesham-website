import crypto from "crypto";

export const DASHBOARD_COOKIE = "mh_dashboard";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sessionSecret(): string {
  return (
    process.env.DASHBOARD_SESSION_SECRET ||
    process.env.DASHBOARD_PASSWORD ||
    ""
  );
}

export function dashboardConfigured(): boolean {
  return Boolean(process.env.DASHBOARD_PASSWORD);
}

export function signSession(): string {
  const exp = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const sig = crypto
    .createHmac("sha256", sessionSecret())
    .update(String(exp))
    .digest("hex");
  return `${exp}.${sig}`;
}

export function verifySession(value: string | undefined | null): boolean {
  if (!value || !sessionSecret()) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const exp = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^\d+$/.test(exp) || !/^[a-f0-9]{64}$/.test(sig)) return false;
  const expected = crypto
    .createHmac("sha256", sessionSecret())
    .update(exp)
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(sig, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now();
}

export function checkPassword(candidate: string): boolean {
  const real = process.env.DASHBOARD_PASSWORD || "";
  if (!real || !candidate) return false;
  // Hash both sides so timingSafeEqual always sees equal-length buffers,
  // whatever the candidate length.
  const digest = (s: string) =>
    crypto.createHash("sha256").update(s, "utf8").digest();
  return crypto.timingSafeEqual(digest(candidate), digest(real));
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
};
