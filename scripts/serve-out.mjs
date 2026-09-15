import http from "node:http";
import { readFile } from "node:fs";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "out");
const PORT = process.env.PORT || 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

function serve(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = pathname === "/" ? "/index.html" : pathname;
  const candidates = [
    normalize(join(ROOT, file)),
    normalize(join(ROOT, file) + ".html"),
    normalize(join(ROOT, file, "index.html")),
  ];
  const tryNext = (i) => {
    if (i >= candidates.length) {
      readFile(join(ROOT, "404.html"), (err, data) => {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(err ? "Not found" : data);
      });
      return;
    }
    readFile(candidates[i], (err, data) => {
      if (err) return tryNext(i + 1);
      res.writeHead(200, {
        "Content-Type":
          MIME[extname(candidates[i]).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    });
  };
  tryNext(0);
}

http.createServer(serve).listen(PORT, () => {
  console.log(`Serving ${ROOT} on http://localhost:${PORT}`);
});