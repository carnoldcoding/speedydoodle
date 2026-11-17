// Make the small, modern copies of the artwork that the pages load.
// Run it with `npm run images` after a source picture in src/assets changes.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const source = "src/assets";
const out = "src/assets/web";

// [source file, name of the copy, widths in pixels]
const pictures = [
  ["splash.png", "splash", [560, 1120]],
  ["logo.png", "logo", [240, 480]],
  ["parties.png", "live", [520]],
  ["gifts.png", "custom", [520, 1040]],
  ["logos.png", "logos", [520]],
];

await mkdir(out, { recursive: true });
for (const [file, name, widths] of pictures) {
  for (const width of widths) {
    const info = await sharp(`${source}/${file}`).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${out}/${name}-${width}.webp`);
    console.log(`${name}-${width}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  }
}

// The three share cards. The PNG files come from docs/design-studies/share-card.html,
// opened at 1200 by 630 pixels in a browser and saved as a screenshot.
await mkdir("public/share", { recursive: true });
for (const card of ["home", "gallery", "services"]) {
  const info = await sharp(`docs/design-studies/img/card-${card}.png`).jpeg({ quality: 86, mozjpeg: true }).toFile(`public/share/${card}.jpg`);
  console.log(`share/${card}.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
