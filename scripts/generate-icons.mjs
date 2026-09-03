/**
 * Regenerates the PWA icon set from a single source definition.
 *
 *   node scripts/generate-icons.mjs
 *
 * Run this only when the mark or the brand colour changes; the output is
 * committed so a normal build needs no image tooling. sharp comes in with
 * Next.js rather than being a direct dependency, which is fine for a script
 * that is not part of the build.
 *
 * Three shapes, because the platforms genuinely differ:
 *
 *   any       Rounded square with transparent corners, for browser tabs and
 *             anywhere the icon sits on an unknown background.
 *   maskable  Full bleed colour with the mark inside the safe zone. Launchers
 *             apply their own mask and crop roughly 10% from every edge, so a
 *             rounded, transparent icon would lose its corners.
 *   apple     Full bleed and fully opaque. iOS composites transparency onto
 *             black and rounds the corners itself.
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const BRAND = "#2f6feb";
const MARK = "#ffffff";
const OUT = "public/icons";

/** Lucide's check, on a 24 unit box. Bounding box is 16 wide by 11 tall. */
const CHECK_PATH = "M20 6 9 17l-5-5";
const CHECK_W = 16;
const CHECK_CX = 12;
const CHECK_CY = 11.5;

function markGroup(size, coverage, strokeWidth) {
  const scale = (size * coverage) / CHECK_W;
  return `<g transform="translate(${size / 2} ${size / 2}) scale(${scale}) translate(${-CHECK_CX} ${-CHECK_CY})">
    <path d="${CHECK_PATH}" fill="none" stroke="${MARK}" stroke-width="${strokeWidth}"
          stroke-linecap="round" stroke-linejoin="round" />
  </g>`;
}

function roundedSvg(size) {
  const radius = size * 0.22;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${BRAND}"/>
    ${markGroup(size, 0.52, 3)}
  </svg>`;
}

function fullBleedSvg(size, coverage) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${BRAND}"/>
    ${markGroup(size, coverage, 3)}
  </svg>`;
}

async function write(name, svg, { flatten = false } = {}) {
  let pipeline = sharp(Buffer.from(svg));
  // iOS shows transparency as black, so that icon is flattened onto the brand
  // colour rather than left with an alpha channel.
  if (flatten) pipeline = pipeline.flatten({ background: BRAND });
  const buffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();
  await writeFile(`${OUT}/${name}`, buffer);
  const { width, height, hasAlpha } = await sharp(buffer).metadata();
  console.log(
    `${name.padEnd(24)} ${width}x${height}  alpha:${hasAlpha}  ${(buffer.length / 1024).toFixed(1)}KB`
  );
}

// The mark covers less of a maskable icon so it survives the launcher's crop.
await write("icon-192.png", roundedSvg(192));
await write("icon-512.png", roundedSvg(512));
await write("maskable-192.png", fullBleedSvg(192, 0.42), { flatten: true });
await write("maskable-512.png", fullBleedSvg(512, 0.42), { flatten: true });
await write("apple-touch-icon.png", fullBleedSvg(180, 0.52), { flatten: true });

const favicon = await sharp(Buffer.from(roundedSvg(64)))
  .resize(32, 32)
  .png({ compressionLevel: 9 })
  .toBuffer();
await writeFile("public/favicon.png", favicon);
console.log(`${"favicon.png".padEnd(24)} 32x32`);
