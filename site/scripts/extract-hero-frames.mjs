/**
 * Turns the hero GIF into individual WebP frames.
 *
 *   node scripts/extract-hero-frames.mjs
 *
 * Why not ship the GIF itself: a GIF cannot be loaded partially, so the hero
 * would block on the whole file before showing anything, and GIF's 256-colour
 * limit bands the rose and navy gradients. As separate frames the browser only
 * needs frame 1 to paint (LCP), and the rest stream in behind it.
 *
 * Re-run this after re-recording phone-hero.gif. No component changes needed:
 * the hero reads however many frames this writes.
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync, rmSync, existsSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, "..", "..", "phone-hero.gif");
const OUT = join(here, "..", "public", "hero");
const MANIFEST = join(here, "..", "src", "lib", "hero-frames.json");

if (!existsSync(SRC)) {
  console.error("Tidak ketemu: " + SRC);
  process.exit(1);
}

const meta = await sharp(SRC, { animated: true }).metadata();
const pages = meta.pages ?? 1;
const pageHeight = meta.pageHeight ?? meta.height;

if (pages < 2) {
  console.error("GIF hanya punya " + pages + " frame. Harus animasi.");
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const frames = [];
let total = 0;

for (let i = 0; i < pages; i++) {
  // one page at a time: extracting from the stacked strip trips libvips
  const buf = await sharp(SRC, { page: i }).webp({ quality: 80, effort: 6 }).toBuffer();
  const name = "frame" + String(i + 1).padStart(2, "0") + ".webp";
  writeFileSync(join(OUT, name), buf);
  frames.push("/hero/" + name);
  total += buf.length;
}

writeFileSync(
  MANIFEST,
  JSON.stringify({ width: meta.width, height: pageHeight, frames }, null, 2) + "\n",
);

const srcKb = (statSync(SRC).size / 1024).toFixed(0);
const outKb = (total / 1024).toFixed(0);
const firstKb = (statSync(join(OUT, "frame01.webp")).size / 1024).toFixed(0);

console.log(pages + " frame " + meta.width + "x" + pageHeight + " ditulis ke public/hero/");
console.log("GIF " + srcKb + " KB  ->  WebP " + outKb + " KB total, " + firstKb + " KB untuk frame pertama");
console.log("manifest: src/lib/hero-frames.json");
