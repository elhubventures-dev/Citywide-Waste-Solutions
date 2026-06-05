/**
 * Converts all Images/Flyers assets to optimized WebP in public/images/gallery/
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "Images", "Flyers");
const outDir = path.join(root, "public", "images", "gallery");

function toSlug(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

if (!fs.existsSync(srcDir)) {
  console.error(`Source folder not found: ${srcDir}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort((a, b) => a.localeCompare(b));

if (files.length === 0) {
  console.error("No image files found in Images/Flyers");
  process.exit(1);
}

const manifest = [];

for (const file of files) {
  const slug = toSlug(file);
  const outName = `${slug}.webp`;
  const input = path.join(srcDir, file);
  const output = path.join(outDir, outName);

  const meta = await sharp(input)
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(output);

  manifest.push({
    slug,
    src: `/images/gallery/${outName}`,
    width: meta.width,
    height: meta.height,
    sourceFile: file,
  });

  console.log(`OK ${outName} <- ${file}`);
}

fs.writeFileSync(
  path.join(root, "src", "lib", "gallery-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);
console.log(`\nWrote manifest (${manifest.length} images) -> src/lib/gallery-manifest.json`);
