// Check the built site against the requirements of docs/specs/site-redesign.md that a
// program can check. Run `npm run build` first, then `npm run check`.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "build/client";
const site = "https://speedydoodle.com";
const failures = [];
let checks = 0;
const check = (requirement, condition, message) => {
  checks++;
  if (!condition) failures.push(`${requirement}: ${message}`);
};

const walk = (folder) => readdirSync(folder).flatMap((name) => {
  const full = join(folder, name);
  return statSync(full).isDirectory() ? walk(full) : [full];
});
const files = walk(root);
// A page is index.html for the home page, and <address>.html for each other page.
const pages = files
  .filter((file) => file.endsWith(".html") && !file.endsWith("__spa-fallback.html"))
  .map((file) => {
    const path = file === join(root, "index.html") ? "/" : file.slice(root.length, -".html".length);
    return { path, html: readFileSync(file, "utf8") };
  });
// No page is left in a folder of its own, because the host would then add a slash to its address.
check("E4", !files.some((file) => file.endsWith("/index.html") && file !== join(root, "index.html")), "a page is still in <address>/index.html");
const page = (path) => pages.find((p) => p.path === path);
const attribute = (html, pattern) => (html.match(pattern) ?? [])[1];
// The words a visitor reads: no scripts, no styles, no tags. A tag inside a line of text
// (a single letter of a title, for example) is removed with no space, as a browser shows it.
const words = (html) => html.replace(/<!--[\s\S]*?-->/g, "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<\/?(span|b|i|em|strong)\b[^>]*>/g, "").replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ");

// F2: a page for each address.
const categories = ["party", "custom", "illustrations", "logos"];
for (const path of ["/", "/services", "/gallery", ...categories.map((c) => `/gallery/${c}`)]) check("F2", !!page(path), `no HTML file for ${path}`);
const drawings = pages.filter((p) => /^\/gallery\/[a-z]+\/.+/.test(p.path));
for (const category of categories) check("F2", drawings.some((p) => p.path.startsWith(`/gallery/${category}/`)), `no drawing page in ${category}`);
check("F2", drawings.length >= 100, `only ${drawings.length} drawing pages`);

// E2, E3, E4, X1, X4, E9: the head and the pictures of each page.
for (const { path, html } of pages) {
  const title = attribute(html, /<title>([^<]*)<\/title>/);
  check("E2", !!title && title.length > 10, `${path} has no real title`);
  check("E2", (attribute(html, /<meta name="description" content="([^"]*)"/) ?? "").length > 30, `${path} has no real description`);
  check("E3", (html.match(/<h1[\s>]/g) ?? []).length === 1, `${path} has ${(html.match(/<h1[\s>]/g) ?? []).length} main headings`);
  check("E4", attribute(html, /<link rel="canonical" href="([^"]*)"/) === site + encodeURI(path), `${path} names ${attribute(html, /<link rel="canonical" href="([^"]*)"/)} as canonical`);
  for (const tag of ["og:title", "og:description", "og:image", "og:url", "og:type", "og:site_name", "og:image:width", "og:image:height", "og:image:alt"]) {
    check("X1", new RegExp(`<meta property="${tag}" content="[^"]+"`).test(html), `${path} has no ${tag}`);
  }
  check("X4", /<meta name="theme-color" content="#b42401"/i.test(html), `${path} has no theme colour`);
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    check("E9", /\swidth="\d+"/.test(img) && /\sheight="\d+"/.test(img), `${path} has a picture with no size: ${img.slice(0, 90)}`);
    check("E7", /\salt="[^"]*"/.test(img), `${path} has a picture with no text description: ${img.slice(0, 90)}`);
  }
}
const main = ["/", "/gallery", "/services"].map(page).filter(Boolean);
check("E2", new Set(main.map((p) => attribute(p.html, /<title>([^<]*)<\/title>/))).size === main.length, "two main pages share a title");
check("E2", new Set(main.map((p) => attribute(p.html, /<meta name="description" content="([^"]*)"/))).size === main.length, "two main pages share a description");

// F3: the text is in the HTML.
const home = page("/");
if (home) {
  const text = words(home.html);
  for (const phrase of ["Here at Speedydoodle Studios, we turn weddings", "an hour, plus travel", "From $225", "consummate professional", "Years of drawing faces", "Let's draw your party"]) check("F3", text.includes(phrase), `the home page HTML lacks "${phrase}"`);
  const heading = words((home.html.match(/<h1[\s\S]*?<\/h1>/) ?? [""])[0]);
  for (const word of ["Caricature", "South Jersey", "Philadelphia", "Delaware"]) check("E3", heading.includes(word), `the main heading of the home page lacks "${word}"`);

  // E5: the structured data.
  const block = attribute(home.html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let data = null;
  try { data = JSON.parse(block); } catch { /* reported below */ }
  check("E5", !!data && data["@type"] === "LocalBusiness", "the home page has no local business data");
  if (data) {
    check("E5", data.address?.addressRegion === "NJ" && data.address?.addressCountry === "US", "the business data lacks the state and the country");
    check("E5", !data.address?.streetAddress && !data.address?.addressLocality && !data.address?.postalCode, "the business data gives a street, a town, or a postal code");
    check("E5", Array.isArray(data.areaServed) && data.areaServed.length === 3 && Array.isArray(data.sameAs) && data.sameAs.length === 2, "the business data lacks the service area or the two links");
  }
}
const services = page("/services");
if (services) {
  const text = words(services.html);
  for (const phrase of ["What can we draw for you?", "Live caricatures", "$150", "$225", "$500"]) check("F3", text.includes(phrase), `the quote form HTML lacks "${phrase}"`);
}
const gallery = page("/gallery");
if (gallery) check("F3", (gallery.html.match(/<img\b[^>]*ik\.imagekit\.io/g) ?? []).length >= 100, "the gallery HTML holds fewer than 100 drawings");

// X2, X3: the share pictures.
for (const [path, card] of [["/", "home"], ["/gallery", "gallery"], ["/services", "services"]]) {
  check("X2", page(path)?.html.includes(`${site}/share/${card}.jpg`) && existsSync(join(root, "share", `${card}.jpg`)), `${path} has no share card`);
}
for (const { path, html } of drawings) {
  const picture = attribute(html, /<meta property="og:image" content="([^"]*)"/) ?? "";
  check("X3", picture.includes("ik.imagekit.io"), `${path} does not share its own drawing`);
}

// E6: the sitemap and the robots file.
const sitemap = existsSync(join(root, "sitemap.xml")) ? readFileSync(join(root, "sitemap.xml"), "utf8") : "";
check("E6", sitemap.startsWith("<?xml"), "sitemap.xml is missing or is not XML");
for (const { path } of pages) check("E6", sitemap.includes(`<loc>${site}${encodeURI(path)}</loc>`), `the sitemap lacks ${path}`);
check("E6", readFileSync(join(root, "robots.txt"), "utf8").includes(`Sitemap: ${site}/sitemap.xml`), "robots.txt does not name the sitemap");

// F4: the two redirects.
const redirects = readFileSync(join(root, "_redirects"), "utf8");
check("F4", /^\/homepage\s+\/\s+301$/m.test(redirects) && /^\/about\s+\/\s+301$/m.test(redirects), "the redirects for /homepage and /about are missing");

// F7: no font from another site. Q16: no phone number of Mike.
for (const file of files.filter((f) => /\.(html|css|js)$/.test(f))) {
  const content = readFileSync(file, "utf8");
  check("F7", !/fonts\.(googleapis|gstatic)\.com/.test(content), `${file} loads a font from another site`);
}
for (const { path, html } of [home, services, gallery].filter(Boolean)) {
  check("Q16", !/\(?\b\d{3}\)?[-. ]\d{3}[-. ]\d{4}\b/.test(words(html)), `${path} shows a phone number`);
  // W1: "he", "him", "his" only inside a customer quote.
  const outsideQuotes = words(html.replace(/<blockquote[\s\S]*?<\/blockquote>/g, " "));
  const found = outsideQuotes.match(/[^.!?]*\b(he|him|his|He|Him|His)\b[^.!?]*/);
  check("W1", !found, `${path} says "${found?.[0].trim().slice(0, 70)}"`);
}

// E8: no picture file of the site itself is larger than 200 KB.
for (const file of files.filter((f) => /\.(webp|png|jpg|jpeg)$/.test(f) && f.includes("/assets/"))) {
  check("E8", statSync(file).size <= 200 * 1024, `${file} is ${Math.round(statSync(file).size / 1024)} KB`);
}

// F6, X5: the source.
const source = walk("src").filter((f) => /\.tsx?$/.test(f) && !f.endsWith(".test.ts")).map((f) => [f, readFileSync(f, "utf8")]);
for (const [file, content] of source) {
  check("F6", !/window\.inner(Width|Height)|matchMedia\(["'`]\(m(ax|in)-width/.test(content), `${file} reads the screen size`);
  check("X5", !/navigator\.userAgent|isbot/i.test(content), `${file} looks at the kind of visitor`);
}

console.log(`${checks} checks, ${failures.length} failed, on ${pages.length} pages`);
for (const failure of [...new Set(failures)].slice(0, 40)) console.log(`  FAIL ${failure}`);
process.exit(failures.length ? 1 : 0);
