/**
 * Full-page screenshots using the Chrome DevTools Protocol.
 *
 * Usage:
 *   node scripts/screenshot.mjs <url> <output.png> [width] [height]
 *
 * Uses Node's built-in WebSocket so no extra dependency is required.
 */
import fs from "fs";
import { spawn } from "child_process";
import os from "os";
import path from "path";

const [
  ,
  ,
  url,
  output,
  widthArg,
  heightArg,
  offsetArg,
  clipHeightArg,
] = process.argv;

if (!url || !output) {
  console.error("Usage: node scripts/screenshot.mjs <url> <out.png> [w] [h]");
  process.exit(1);
}

const width = Number(widthArg ?? 1440);
const height = Number(heightArg ?? 900);

const chromePaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

const chrome = chromePaths.find((p) => fs.existsSync(p));

if (!chrome) {
  console.error("No Chrome/Edge binary found.");
  process.exit(1);
}

const port = 9333 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "cdp-"));

const child = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    `--window-size=${width},${height}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(path, method = "GET") {
  const response = await fetch(
    `http://127.0.0.1:${port}${path}`,
    { method }
  );

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text.slice(0, 200));
  }
}

async function waitForDevTools() {
  for (let i = 0; i < 60; i++) {
    try {
      await getJson("/json/version");
      return true;
    } catch {
      await sleep(250);
    }
  }
  return false;
}

let nextId = 0;

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(wsUrl);
    const pending = new Map();

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.id && pending.has(message.id)) {
        const { resolve: done, reject: fail } =
          pending.get(message.id);

        pending.delete(message.id);

        if (message.error) fail(message.error);
        else done(message.result);
      }
    });

    socket.addEventListener("error", reject);

    socket.addEventListener("open", () => {
      resolve({
        socket,
        send(method, params = {}) {
          const id = ++nextId;

          return new Promise((res, rej) => {
            pending.set(id, {
              resolve: res,
              reject: rej,
            });

            socket.send(
              JSON.stringify({ id, method, params })
            );
          });
        },
      });
    });
  });
}

try {
  if (!(await waitForDevTools())) {
    throw new Error("DevTools endpoint never came up.");
  }

  const target = await getJson(
    `/json/new?${encodeURIComponent(url)}`,
    "PUT"
  );

  const client = await connect(
    target.webSocketDebuggerUrl
  );

  await client.send("Page.enable");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 700,
  });

  await sleep(2500);

  const metrics = await client.send(
    "Page.getLayoutMetrics"
  );

  const contentHeight = Math.ceil(
    metrics.cssContentSize?.height ?? height
  );

  const offset = Number(offsetArg ?? 0);
  const clipHeight = Number(clipHeightArg ?? 0);

  const shot = await client.send(
    "Page.captureScreenshot",
    {
      format: "png",
      captureBeyondViewport: true,
      clip: {
        x: 0,
        y: offset,
        width,
        height: clipHeight || contentHeight,
        scale: 1,
      },
    }
  );

  fs.writeFileSync(
    output,
    Buffer.from(shot.data, "base64")
  );

  console.log(
    `saved ${output} (${width}x${contentHeight})`
  );

  client.socket.close();
} catch (error) {
  console.error("Screenshot failed:", error);
  process.exitCode = 1;
} finally {
  child.kill();
}
