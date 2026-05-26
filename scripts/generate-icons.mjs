import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "logo.png");
const outputDir = path.join(root, "public");
const markCrop = { left: 110, top: 220, width: 470, height: 470 };

async function createIcon(size, fileName) {
  const innerSize = Math.round(size * 0.84);
  const mark = await sharp(source)
    .extract(markCrop)
    .resize(innerSize, innerSize, { fit: "contain" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(path.join(outputDir, fileName));
}

async function createPngBuffer(size) {
  const innerSize = Math.round(size * 0.84);
  const mark = await sharp(source)
    .extract(markCrop)
    .resize(innerSize, innerSize, { fit: "contain" })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
}

function createIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, buffer }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((image) => image.buffer)]);
}

async function createOgImage() {
  const logo = await sharp(source)
    .resize(920, 360, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(path.join(outputDir, "og-image.png"));
}

async function main() {
  await Promise.all([
    createIcon(16, "icon-16.png"),
    createIcon(32, "icon-32.png"),
    createIcon(180, "apple-touch-icon.png"),
    createIcon(192, "icon-192.png"),
    createIcon(512, "icon-512.png"),
  ]);

  const icoImages = await Promise.all(
    [16, 32, 48].map(async (size) => ({
      size,
      buffer: await createPngBuffer(size),
    }))
  );
  fs.writeFileSync(path.join(outputDir, "favicon.ico"), createIco(icoImages));

  await createOgImage();

  const maskIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path fill="#000" d="M256 40c95 0 176 62 204 148h-66c-24-52-77-88-138-88-84 0-153 68-153 153 0 29 8 56 22 79l54-54 32 32-97 97-97-97 32-32 30 30a213 213 0 0 1-19-88C60 121 148 40 256 40Zm-78 319h52V223h-52v136Zm76 0h52V171h-52v188Zm76 0h52V249h-52v110Z"/>
</svg>
`;
  fs.writeFileSync(path.join(outputDir, "safari-pinned-tab.svg"), maskIcon);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
