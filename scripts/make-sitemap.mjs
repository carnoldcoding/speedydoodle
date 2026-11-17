// Write sitemap.xml from the pages that the build made. Each folder with an index.html is one page.
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = "build/client";
const site = "https://speedydoodle.com";

function pages(folder, path) {
  const found = [];
  for (const name of readdirSync(folder)) {
    const full = join(folder, name);
    if (statSync(full).isDirectory()) found.push(...pages(full, `${path}/${name}`));
    else if (name === "index.html") found.push(path === "" ? "/" : path);
  }
  return found;
}

const list = pages(root, "").sort((a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b));
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...list.map((path) => `  <url><loc>${site}${encodeURI(path)}</loc></url>`),
  "</urlset>",
  "",
].join("\n");
writeFileSync(join(root, "sitemap.xml"), xml);
console.log(`sitemap.xml: ${list.length} pages`);
