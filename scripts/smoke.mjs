// Smoke test: fetch key routes and assert HTTP 200.
// Usage: npm run build && npm start, then `npm run smoke`
const base =
  process.env.SMOKE_BASE_URL || "http://localhost:3000";

const routes = [
  "/",
  "/about",
  "/contact",
  "/work",
  "/work/al-mashreq",
  "/work/infinity-connect-group",
  "/work/memo-trips",
  "/work/alitalia",
  "/work/atractive-collection",
  "/work/diana-essential-body-hair-care",
  "/work/everest",
  "/work/olive-branch",
  "/work/ultrascan",
  "/sitemap.xml",
  "/robots.txt",
];

let failed = false;

for (const route of routes) {
  try {
    const response = await fetch(base + route);

    const ok = response.status === 200;

    if (!ok) failed = true;

    console.log(
      `${ok ? "PASS" : "FAIL"} ${route} -> ${response.status}`
    );
  } catch (error) {
    failed = true;
    console.log(`FAIL ${route} -> ${error.message}`);
  }
}

const bad = await fetch(base + "/work/does-not-exist").catch(
  () => null
);

if (bad && bad.status === 404) {
  console.log("PASS /work/does-not-exist -> 404");
} else {
  failed = true;
  console.log("FAIL /work/does-not-exist -> expected 404");
}

process.exit(failed ? 1 : 0);
