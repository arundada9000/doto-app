/**
 * Sanity check over the built static export.
 *
 *   npm run build && node scripts/check-export.mjs
 *
 * Catches the failures that only appear once the site is assembled: internal
 * links that point at nothing, images missing from the output, images with no
 * alt text, and pages with the wrong number of top-level headings.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = "out";
const pages = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) pages.push(full);
  }
}

/** Resolves a site-absolute URL against the exported file tree. */
function resolves(url) {
  if (!url.startsWith("/")) return true;
  const clean = url.split("?")[0].split("#")[0];
  if (/\.[a-z0-9]+$/i.test(clean)) return existsSync(join(ROOT, clean));
  const trimmed = clean.replace(/\/$/, "");
  return (
    existsSync(join(ROOT, trimmed, "index.html")) ||
    existsSync(join(ROOT, `${trimmed}.html`)) ||
    existsSync(join(ROOT, trimmed))
  );
}

walk(ROOT);

let problems = 0;
const report = (...args) => {
  problems += 1;
  console.log(...args);
};

for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const name = file.split("\\").join("/");

  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const url = match[1];
    if (url.startsWith("/_next/")) continue;
    if (!resolves(url)) report("broken link  ", name, "->", url);
  }

  for (const match of html.matchAll(/<img[^>]+src="(\/[^"]+)"/g)) {
    if (!resolves(match[1])) report("missing image", name, "->", match[1]);
  }

  const images = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  const missingAlt = images.filter((img) => !/alt="[^"]+"/.test(img));
  if (missingAlt.length) {
    report("image without alt", name, missingAlt.length);
  }

  // The app routes are client rendered and marked noindex on purpose, so their
  // static HTML carries no headings. Only public pages are held to this.
  const isIndexable = !/name="robots" content="noindex/.test(html);
  const headings = (html.match(/<h1[\s>]/g) || []).length;
  if (isIndexable && headings !== 1 && !name.includes("_not-found")) {
    report("h1 count", name, headings);
  }
}

console.log(`\nchecked ${pages.length} pages, ${problems} problems`);
process.exit(problems > 0 ? 1 : 0);
