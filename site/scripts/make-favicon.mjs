/**
 * Builds app/icon.jpg and app/favicon.ico from a single source image.
 *
 *   node scripts/make-favicon.mjs ../lovamoment-favicon.jpg
 *
 * Both files come from the same source so the icon is consistent everywhere:
 * icon.jpg drives the <link rel="icon"> tag Next.js emits, but browsers also
 * do their own implicit GET /favicon.ico in places that never read <head>
 * (bookmarking before the page parses, some crawlers). Leaving the default
 * Next.js favicon.ico in place while only adding icon.jpg would mean those
 * paths keep showing the stock triangle instead of the real brand icon.
 *
 * favicon.ico is built as PNG-in-ICO (valid since Windows Vista, and what
 * every modern browser expects) rather than pulling in an ICO-encoding
 * dependency for a file that changes rarely.
 */
import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const APP_DIR = join(here, "..", "src", "app");
const src = process.argv[2];

if (!src) {
  console.error("Pakai: node scripts/make-favicon.mjs <path-ke-sumber.jpg>");
  process.exit(1);
}

const meta = await sharp(src).metadata();
if (meta.width !== meta.height) {
  console.error("Sumber " + meta.width + "x" + meta.height + " bukan persegi. Crop dulu jadi persegi.");
  process.exit(1);
}

// icon.jpg: served as-is, Next reports its real dimensions in the <link> tag
// and the browser downsamples for the tab. No re-encoding needed at this size.
const iconJpg = await sharp(src).jpeg({ quality: 90 }).toBuffer();
writeFileSync(join(APP_DIR, "icon.jpg"), iconJpg);

// favicon.ico: classic sizes, each frame a PNG payload wrapped in an ICO container.
// ensureAlpha is required: Next's ICO reader (Rust's `image` crate) rejects
// RGB PNGs inside an ICO with "The PNG is not in RGBA format", and the source
// JPEG has no alpha channel to begin with.
const SIZES = [16, 32, 48];
const pngs = await Promise.all(
  SIZES.map((s) => sharp(src).resize(s, s).ensureAlpha().png().toBuffer()),
);

const HEADER = 6;
const ENTRY = 16;
let offset = HEADER + ENTRY * SIZES.length;

const header = Buffer.alloc(HEADER);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(SIZES.length, 4);

const entries = SIZES.map((size, i) => {
  const png = pngs[i];
  const entry = Buffer.alloc(ENTRY);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width, 0 means 256
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // no palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});

const ico = Buffer.concat([header, ...entries, ...pngs]);
writeFileSync(join(APP_DIR, "favicon.ico"), ico);

console.log("icon.jpg     " + meta.width + "x" + meta.height + "  " + (iconJpg.length / 1024).toFixed(0) + " KB");
console.log("favicon.ico  " + SIZES.join("/") + "px  " + (ico.length / 1024).toFixed(0) + " KB");
