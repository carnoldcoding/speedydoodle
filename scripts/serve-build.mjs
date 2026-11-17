// Serve the built site the way the host does: /gallery answers with gallery.html, an address
// with a slash at its end redirects to the address without it, the two old addresses redirect,
// and an unknown address gets the fallback page.
// Usage: node scripts/serve-build.mjs [port] [address to listen on]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const root = resolve("build/client");
const port = Number(process.argv[2] ?? 4173);
const host = process.argv[3] ?? "127.0.0.1";
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".ico": "image/x-icon", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".data": "text/x-script" };
const redirects = { "/homepage": "/", "/about": "/" };

createServer((request, response) => {
  const path = decodeURIComponent(request.url.split("?")[0]);
  if (redirects[path]) {
    response.writeHead(301, { Location: redirects[path] });
    response.end();
    return;
  }
  let file = join(root, path);
  if (!file.startsWith(root)) {
    response.writeHead(403);
    response.end();
    return;
  }
  if (path.length > 1 && path.endsWith("/")) {
    response.writeHead(301, { Location: path.slice(0, -1) + (request.url.includes("?") ? request.url.slice(request.url.indexOf("?")) : "") });
    response.end();
    return;
  }
  if (path === "/") file = join(root, "index.html");
  else if (existsSync(`${file}.html`)) file = `${file}.html`;
  else if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, "__spa-fallback.html");
  response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
  createReadStream(file).pipe(response);
}).listen(port, host, () => console.log(`The built site is at http://${host}:${port}`));
