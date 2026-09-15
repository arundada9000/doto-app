// Viewport screenshots (desktop + mobile) via Chrome DevTools Protocol.
// Emulates prefers-reduced-motion so all reveals render visible.
// Usage: node scripts/screenshot.mjs [port]
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = Number(process.argv[2] || 9223);
const base = `http://127.0.0.1:${port}`;
const outDir = join(root, "docs", "screenshots");

const desktop = { width: 1440, height: 900, dsf: 2, mobile: false };
const mobile = { width: 390, height: 844, dsf: 3, mobile: true };

const shots = [
  { key: "landing", url: "http://localhost:4173/", vp: desktop, file: "landing-desktop.png" },
  { key: "blog", url: "http://localhost:4173/blog/", vp: desktop, file: "blog-desktop.png" },
  { key: "article", url: "http://localhost:4173/blog/install-doto-as-an-app/", vp: desktop, file: "article-desktop.png" },
  { key: "inbox", url: "http://localhost:4173/inbox/", vp: desktop, file: "inbox-desktop.png" },
  { key: "settings", url: "http://localhost:4173/settings/", vp: desktop, file: "settings-desktop.png" },
  { key: "landing", url: "http://localhost:4173/", vp: mobile, file: "landing-mobile.png" },
  { key: "blog", url: "http://localhost:4173/blog/", vp: mobile, file: "blog-mobile.png" },
  { key: "article", url: "http://localhost:4173/blog/install-doto-as-an-app/", vp: mobile, file: "article-mobile.png" },
  { key: "today", url: "http://localhost:4173/today/", vp: mobile, file: "today-mobile.png" },
  { key: "settings", url: "http://localhost:4173/settings/", vp: mobile, file: "settings-mobile.png" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await fetch(`${base}/json/list`).then((r) => r.json());
      const page = list.find((t) => t.type === "page");
      if (page) return new Cdp(page.webSocketDebuggerUrl);
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Timed out waiting for Chrome CDP");
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
    this.ready = new Promise((res, rej) => {
      this.ws.onopen = res;
      this.ws.onerror = rej;
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

const cdp = await connect();
await cdp.send("Page.enable");
await cdp.send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: "reduce" }],
});

let lastVp = null;
for (const shot of shots) {
  if (lastVp !== shot.vp) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: shot.vp.width,
      height: shot.vp.height,
      deviceScaleFactor: shot.vp.dsf,
      mobile: shot.vp.mobile,
    });
    lastVp = shot.vp;
  }
  await cdp.send("Page.navigate", { url: shot.url });
  await sleep(1500);
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, shot.file), Buffer.from(data, "base64"));
  console.log(`wrote ${shot.file} (${(Buffer.byteLength(data) / 1024).toFixed(0)}KB)`);
}

cdp.close();
process.exit(0);