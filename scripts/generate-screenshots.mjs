/**
 * Renders product shots of the DoTo interface for the manifest and the landing
 * page.
 *
 *   node scripts/generate-screenshots.mjs
 *
 * These are drawn from the same token values as the application's light theme
 * rather than captured from a running browser, so they stay pixel sharp at any
 * size and cannot drift out of date with a stale capture. They are illustrative
 * of the real layout, not photographs of it. Regenerate after a visual change.
 */
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const OUT = "public/screenshots";

// Light theme, copied from :root in src/app/globals.css.
const T = {
  bg: "#f4f5f7",
  surface: "#ffffff",
  textPrimary: "#1b1b1f",
  textSecondary: "#6b6f76",
  textTertiary: "#9aa0a8",
  border: "#e4e6e9",
  borderStrong: "#d0d3d8",
  accent: "#2f6feb",
  accentSoft: "#e6eefd",
  secondary: "#17a673",
  secondarySoft: "#e3f5ee",
  error: "#c64f5d",
  errorSoft: "#f8e9eb",
  onAccent: "#ffffff",
};

const FONT = "Segoe UI, Inter, system-ui, sans-serif";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const rect = (x, y, w, h, { r = 0, fill = "none", stroke, sw = 1 } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}"${
    stroke ? ` stroke="${stroke}" stroke-width="${sw}"` : ""
  }/>`;

const text = (
  x,
  y,
  content,
  { size = 16, weight = 400, fill = T.textPrimary, anchor = "start" } = {}
) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(
    content
  )}</text>`;

/** An unchecked task circle, matching the 24px control in the app. */
const circle = (cx, cy, r, { stroke = T.borderStrong, sw = 2.5, fill = "none" } = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

const check = (cx, cy, size, color = T.onAccent) => {
  const s = size / 16;
  return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-12 -11.5)">
    <path d="M20 6 9 17l-5-5" fill="none" stroke="${color}" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round"/></g>`;
};

const flame = (cx, cy, size, color) => {
  const s = size / 24;
  return `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-12 -12)">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
          fill="none" stroke="${color}" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"/></g>`;
};

function progressRing(cx, cy, radius, ratio) {
  const c = 2 * Math.PI * radius;
  return `
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${T.border}" stroke-width="5"/>
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${T.secondary}" stroke-width="5"
            stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - ratio)}"
            transform="rotate(-90 ${cx} ${cy})"/>
    ${text(cx, cy + 6, `${Math.round(ratio * 100)}%`, {
      size: 17,
      weight: 600,
      anchor: "middle",
    })}`;
}

/** One task row: circle, title, and an optional due pill on the right. */
function taskRow(x, y, w, { title, done = false, pill, pillTone = "accent", tags = [] }) {
  const cy = y + 26;
  const pillFill =
    pillTone === "error" ? T.errorSoft : pillTone === "muted" ? T.bg : T.accentSoft;
  const pillText =
    pillTone === "error" ? T.error : pillTone === "muted" ? T.textTertiary : T.accent;

  let out = "";
  if (done) {
    out += `<circle cx="${x + 20}" cy="${cy}" r="11" fill="${T.secondary}"/>`;
    out += check(x + 20, cy, 13);
  } else {
    out += circle(x + 20, cy, 10);
  }
  out += text(x + 44, cy + 6, title, {
    size: 17,
    fill: done ? T.textTertiary : T.textPrimary,
  });
  if (done) {
    const width = title.length * 8.4;
    out += `<line x1="${x + 44}" y1="${cy + 1}" x2="${x + 44 + width}" y2="${cy + 1}" stroke="${T.textTertiary}" stroke-width="1.5"/>`;
  }
  let tagX = x + 44;
  tags.forEach((tag) => {
    const tw = tag.length * 7.6 + 18;
    out += rect(tagX, cy + 14, tw, 22, { r: 11, fill: T.accentSoft });
    out += text(tagX + 9, cy + 29, `#${tag}`, { size: 12, weight: 500, fill: T.accent });
    tagX += tw + 8;
  });
  if (pill) {
    const pw = pill.length * 8 + 26;
    out += rect(x + w - pw - 16, y + 14, pw, 26, { r: 13, fill: pillFill });
    out += text(x + w - pw / 2 - 16, y + 32, pill, {
      size: 13,
      weight: 500,
      fill: pillText,
      anchor: "middle",
    });
  }
  return out;
}

function sidebar(h) {
  const w = 260;
  let out = rect(0, 0, w, h, { fill: T.surface });
  out += `<line x1="${w}" y1="0" x2="${w}" y2="${h}" stroke="${T.border}" stroke-width="1"/>`;
  out += text(28, 52, "DoTo", { size: 22, weight: 600 });
  out += rect(w - 60, 32, 30, 30, { r: 8, fill: T.bg });
  out += text(w - 45, 53, "+", { size: 19, weight: 500, fill: T.textSecondary, anchor: "middle" });

  out += rect(20, 80, w - 40, 40, { r: 10, fill: T.bg });
  out += text(40, 105, "Search everything", { size: 14, fill: T.textTertiary });

  const links = [
    ["Inbox", "I", false],
    ["Today", "T", true],
    ["Completed", "C", false],
    ["Settings", "S", false],
  ];
  links.forEach(([label, key, active], i) => {
    const y = 140 + i * 46;
    if (active) out += rect(16, y, w - 32, 40, { r: 10, fill: T.accentSoft });
    out += text(44, y + 26, label, {
      size: 15,
      weight: active ? 500 : 400,
      fill: active ? T.accent : T.textSecondary,
    });
    out += rect(w - 52, y + 10, 22, 20, { r: 5, fill: "none", stroke: T.border });
    out += text(w - 41, y + 25, key, { size: 11, fill: T.textTertiary, anchor: "middle" });
  });
  return out;
}

function wideToday(W, H) {
  const x = 260;
  const w = W - x;
  let out = rect(0, 0, W, H, { fill: T.bg }) + sidebar(H);

  out += text(x + 40, 56, "Good afternoon, Arun", { size: 15, weight: 500, fill: T.accent });
  out += text(x + 40, 100, "Today", { size: 38, weight: 600 });
  out += text(x + 40, 130, "Thursday, September 3", { size: 16, fill: T.textSecondary });
  out += `<line x1="${x}" y1="164" x2="${W}" y2="164" stroke="${T.border}" stroke-width="1"/>`;

  out += progressRing(x + 70, 214, 26, 0.6);
  out += text(x + 116, 208, "Finished 3 tasks today", { size: 16, weight: 500 });
  out += text(x + 116, 232, "2 tasks still on today's plate.", { size: 14, fill: T.textTertiary });
  out += rect(W - 118, 194, 74, 40, { r: 10, fill: T.surface, stroke: T.border });
  out += flame(W - 96, 214, 18, T.accent);
  out += text(W - 74, 221, "12", { size: 17, weight: 600 });
  out += `<line x1="${x}" y1="264" x2="${W}" y2="264" stroke="${T.border}" stroke-width="1"/>`;

  out += text(x + 44, 300, "OVERDUE", { size: 12, weight: 600, fill: T.error });
  out += taskRow(x + 24, 316, w - 60, {
    title: "Send the invoice to Sajilo Digital",
    pill: "2d ago",
    pillTone: "error",
  });

  out += text(x + 44, 410, "LATER TODAY", { size: 12, weight: 600, fill: T.textTertiary });
  const rows = [
    { title: "Call Ram about the police portal", pill: "10:00", tags: ["work"] },
    { title: "Draft the offline sync notes", pill: "14:30" },
    { title: "Water the plants", pill: "18:00", tags: ["home"] },
  ];
  rows.forEach((r, i) => {
    out += taskRow(x + 24, 426 + i * 78, w - 60, r);
  });

  out += taskRow(x + 24, 426 + 3 * 78 + 10, w - 60, {
    title: "Review the pull request",
    done: true,
    pill: "Done",
    pillTone: "muted",
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out}</svg>`;
}

/** The Inbox screen body, shared so the capture shot has a real page behind it. */
function inboxBody(W, H) {
  let out = rect(0, 0, W, H, { fill: T.bg });
  out += text(40, 100, "Good afternoon, Arun", { size: 26, weight: 500, fill: T.accent });
  out += text(40, 172, "Inbox", { size: 62, weight: 600 });
  out += text(40, 222, "Everything you capture lands here.", { size: 26, fill: T.textSecondary });
  out += `<line x1="0" y1="264" x2="${W}" y2="264" stroke="${T.border}" stroke-width="2"/>`;

  const rows = [
    { title: "Rewrite the onboarding copy", tags: ["work"] },
    { title: "Book the bus to Butwal", pill: "Fri" },
    { title: "Idea: offline-first sync log" },
    { title: "Read the PostGIS docs", tags: ["reading"] },
    { title: "Pay the internet bill", pill: "Mon" },
    { title: "Buy milk" },
  ];
  rows.forEach((r, i) => {
    out += taskRow(24, 300 + i * 150, W - 48, {
      ...r,
      title: r.title,
    });
  });

  // Bottom navigation
  const navY = H - 170;
  out += rect(0, navY, W, 170, { fill: T.surface });
  out += `<line x1="0" y1="${navY}" x2="${W}" y2="${navY}" stroke="${T.border}" stroke-width="2"/>`;
  out += rect(W / 2 - 62, navY - 34, 124, 124, { r: 62, fill: T.accent });
  out += text(W / 2, navY + 46, "+", { size: 76, weight: 400, fill: T.onAccent, anchor: "middle" });
  out += rect(90, navY + 30, 110, 60, { r: 14, fill: T.accentSoft });
  out += text(145, navY + 68, "Inbox", { size: 22, weight: 500, fill: T.accent, anchor: "middle" });
  out += text(330, navY + 68, "Today", { size: 22, fill: T.textTertiary, anchor: "middle" });
  out += text(W - 330, navY + 68, "Done", { size: 22, fill: T.textTertiary, anchor: "middle" });
  out += text(W - 145, navY + 68, "Settings", { size: 22, fill: T.textTertiary, anchor: "middle" });
  return out;
}

function narrowInbox(W, H) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${inboxBody(
    W,
    H
  )}</svg>`;
}

function narrowCapture(W, H) {
  // The real dialog sits over the Inbox, so the page is drawn first and dimmed
  // rather than the card floating on an empty field.
  let out = inboxBody(W, H);
  out += rect(0, 0, W, H, { fill: "rgba(15,17,20,0.55)" });

  const cardY = 300;
  const cardH = 460;
  out += rect(40, cardY, W - 80, cardH, { r: 28, fill: T.surface });
  out += `<line x1="40" y1="${cardY + 96}" x2="${W - 40}" y2="${cardY + 96}" stroke="${T.border}" stroke-width="2"/>`;
  out += text(84, cardY + 60, "Quick Capture", { size: 26, weight: 500, fill: T.textSecondary });

  out += text(80, cardY + 176, "Call Ram tomorrow at 10", { size: 34, fill: T.textPrimary });
  // Caret sits at the end of the typed text, where it would actually be.
  out += rect(468, cardY + 148, 3, 38, { fill: T.accent });

  out += rect(80, cardY + 236, 210, 44, { r: 22, fill: T.accentSoft });
  out += text(185, cardY + 265, "Sep 4, 10:00", { size: 21, weight: 500, fill: T.accent, anchor: "middle" });
  out += rect(304, cardY + 236, 130, 44, { r: 22, fill: T.accentSoft });
  out += text(369, cardY + 265, "#work", { size: 21, weight: 500, fill: T.accent, anchor: "middle" });

  out += `<line x1="40" y1="${cardY + cardH - 96}" x2="${W - 40}" y2="${cardY + cardH - 96}" stroke="${T.border}" stroke-width="2"/>`;
  out += rect(W - 250, cardY + cardH - 76, 190, 58, { r: 14, fill: T.accent });
  out += text(W - 155, cardY + cardH - 38, "Capture", {
    size: 23,
    weight: 500,
    fill: T.onAccent,
    anchor: "middle",
  });
  out += text(84, cardY + cardH - 38, "Try “Buy milk”", { size: 21, fill: T.textTertiary });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${out}</svg>`;
}

async function render(name, svg) {
  const buffer = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(`${OUT}/${name}`, buffer);
  const { width, height } = await sharp(buffer).metadata();
  console.log(`${name.padEnd(30)} ${width}x${height}  ${(buffer.length / 1024).toFixed(1)}KB`);
}

await mkdir(OUT, { recursive: true });
await render("today-wide.png", wideToday(1600, 820));
await render("inbox-narrow.png", narrowInbox(1080, 1920));
await render("capture-narrow.png", narrowCapture(1080, 1920));
