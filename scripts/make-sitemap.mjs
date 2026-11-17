// Two steps after the build.
//
// 1. Move each page from <address>/index.html to <address>.html. The host serves a file named
//    gallery.html at /gallery. It serves gallery/index.html at /gallery/, and redirects /gallery
//    to it. The site names /gallery as the address of the page, so the file must be gallery.html.
// 2. Write sitemap.xml with the address of each page.
import { readdirSync, renameSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = "build/client";
const site = "https://speedydoodle.com";

// Each folder below the root that holds an index.html, as an address such as "/gallery/logos".
function pageFolders(folder, address) {
  const found = [];
  for (const name of readdirSync(folder)) {
    const full = join(folder, name);
    if (!statSync(full).isDirectory()) continue;
    found.push(...pageFolders(full, `${address}/${name}`));
    if (readdirSync(full).includes("index.html")) found.push(`${address}/${name}`);
  }
  return found;
}

const addresses = pageFolders(root, "");
for (const address of addresses) renameSync(join(root, address, "index.html"), join(root, `${address}.html`));

const list = ["/", ...addresses].sort((a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b));
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...list.map((address) => `  <url><loc>${site}${encodeURI(address)}</loc></url>`),
  "</urlset>",
  "",
].join("\n");
writeFileSync(join(root, "sitemap.xml"), xml);
console.log(`${list.length} pages: each one is a file named for its address, and sitemap.xml lists them`);
