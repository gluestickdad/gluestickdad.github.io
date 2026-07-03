/**
 * One-off asset generator — run manually with `bun run assets`.
 *
 * - Moves the original (heavy) banners into assets-src/ on first run; that
 *   folder stays the committed source of truth.
 * - Writes optimized outputs into public/: favicon set, PWA icons, a 1200x630
 *   social card (og-image.png), and resized WebP + PNG banners.
 *
 * Outputs are committed, so CI never runs this.
 */
import { existsSync, mkdirSync, renameSync, statSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const root = path.resolve(import.meta.dir, "..");
const pub = path.join(root, "public");
const srcDir = path.join(root, "assets-src");

mkdirSync(srcDir, { recursive: true });
for (const name of ["banner-dark.png", "banner-light.png"]) {
  const from = path.join(pub, name);
  const to = path.join(srcDir, name);
  if (!existsSync(to) && existsSync(from)) {
    renameSync(from, to);
    console.log(`moved public/${name} -> assets-src/${name}`);
  }
}

const avatar = path.join(pub, "glue-stick-avatar.jpeg");

function report(file: string) {
  const kb = (statSync(file).size / 1024).toFixed(1);
  console.log(`${path.relative(root, file)}  ${kb} KB`);
}

async function icons() {
  const sizes = {
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "icon-192.png": 192,
    "icon-512.png": 512,
  };
  for (const [name, size] of Object.entries(sizes)) {
    const out = path.join(pub, name);
    await sharp(avatar).resize(size, size, { fit: "cover" }).png().toFile(out);
    report(out);
  }
  const icoPngs = await Promise.all(
    [16, 32, 48].map((s) => sharp(avatar).resize(s, s, { fit: "cover" }).png().toBuffer()),
  );
  const out = path.join(pub, "favicon.ico");
  await writeFile(out, await pngToIco(icoPngs));
  report(out);
}

async function banners() {
  for (const name of ["banner-dark", "banner-light"]) {
    const input = path.join(srcDir, `${name}.png`);
    const resized = sharp(input).resize({ width: 1600, withoutEnlargement: true });

    const webpOut = path.join(pub, `${name}.webp`);
    await resized.clone().webp({ quality: 80 }).toFile(webpOut);
    report(webpOut);

    const pngOut = path.join(pub, `${name}.png`);
    await resized.clone().png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(pngOut);
    report(pngOut);

    const meta = await sharp(pngOut).metadata();
    console.log(`  ${name}: ${meta.width}x${meta.height}`);
  }
}

async function ogImage() {
  const out = path.join(pub, "og-image.png");
  await sharp(path.join(srcDir, "banner-dark.png"))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(out);
  report(out);
}

await icons();
await banners();
await ogImage();
console.log("done");
