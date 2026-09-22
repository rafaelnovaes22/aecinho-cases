const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "public");
const PORT = Number(process.env.PORT || 8080);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};

function send(res, code, body, type) {
  res.writeHead(code, { "content-type": type || "text/plain; charset=utf-8" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://x");

  if (url.pathname === "/health") {
    return send(res, 200, JSON.stringify({ ok: true, service: "aecinho-cases" }), TYPES[".json"]);
  }

  if (url.pathname === "/api/quote" && req.method === "POST") {
    let raw = "";
    req.on("data", (c) => { raw += c; });
    req.on("end", () => {
      try {
        const data = JSON.parse(raw || "{}");
        const tipo = String(data.tipo || "Case de instrumento");
        return send(res, 200, JSON.stringify({ ok: true, tipo, prazo: "15 dias úteis", canal: "whatsapp" }), TYPES[".json"]);
      } catch {
        return send(res, 400, JSON.stringify({ ok: false }), TYPES[".json"]);
      }
    });
    return;
  }

  const file = url.pathname === "/" ? "/index.html" : url.pathname;
  const full = path.normalize(path.join(ROOT, file));
  if (!full.startsWith(ROOT)) return send(res, 403, "forbidden");
  fs.readFile(full, (err, buf) => {
    if (err) {
      fs.readFile(path.join(ROOT, "index.html"), (e2, fallback) => {
        if (e2) return send(res, 404, "not found");
        return send(res, 200, fallback, TYPES[".html"]);
      });
      return;
    }
    send(res, 200, buf, TYPES[path.extname(full).toLowerCase()] || "application/octet-stream");
  });
});

server.listen(PORT, () => console.log(JSON.stringify({ msg: "aecinho up", port: PORT })));
