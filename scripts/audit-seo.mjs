/**
 * Reports the SEO surface of the built export so gaps are visible rather than
 * assumed. Read-only: it never fails the build.
 *
 *   npm run build && node scripts/audit-seo.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const pages = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === "index.html") pages.push(full);
  }
}
walk("out");

const pick = (html, re) => (html.match(re) || [])[1];

console.log("page                                 title  desc  canon og:img tw:img  ld+json");
console.log("-".repeat(84));

for (const file of pages.sort()) {
  const html = readFileSync(file, "utf8");
  const name = file.split("\\").join("/").replace(/^out/, "").replace(/index\.html$/, "") || "/";
  const noindex = /name="robots" content="noindex/.test(html);

  const title = pick(html, /<title>([^<]*)<\/title>/) ?? "";
  const desc = pick(html, /<meta name="description" content="([^"]*)"/) ?? "";
  const canonical = /<link rel="canonical"/.test(html);
  const ogImage = /property="og:image"/.test(html);
  const twImage = /name="twitter:image"/.test(html);

  const blocks = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )].map((m) => m[1]);
  let types = [];
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block);
      const nodes = parsed["@graph"] ?? [parsed];
      types.push(...nodes.map((n) => n["@type"]).filter(Boolean));
    } catch {
      types.push("INVALID-JSON");
    }
  }

  console.log(
    (noindex ? `${name} (noindex)` : name).padEnd(36) +
      String(title.length).padStart(5) +
      String(desc.length).padStart(6) +
      (canonical ? "   yes" : "    NO") +
      (ogImage ? "    yes" : "     NO") +
      (twImage ? "    yes" : "     NO") +
      "  " +
      (types.length ? types.join(",") : "none")
  );

  if (!noindex) {
    if (title.length > 60) console.log(`    ! title is ${title.length} chars, over the usual 60 shown`);
    if (desc.length > 160) console.log(`    ! description is ${desc.length} chars, over the usual 160`);
    if (desc.length < 70 && desc.length > 0) console.log(`    ! description is only ${desc.length} chars`);
  }
}

console.log("\nSite files");
for (const f of ["robots.txt", "sitemap.xml", "manifest.webmanifest", "opengraph-image", "rss.xml", "feed.xml"]) {
  console.log(`  ${f.padEnd(22)} ${existsSync(join("out", f)) ? "present" : "absent"}`);
}
