// Throwaway parity tool for the UI redesign (deleted in Task 10).
// Usage: node tasks/tools/text-snapshot.mjs dist > out.txt
// Emits visible body text per route (header/footer/script/style stripped)
// followed by internal links that do not resolve to a built file.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.argv[2] ?? "dist";
const BASE = "/portfolio-template";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", apos: "'", nbsp: " " };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z#0-9]+);/gi, (m, n) => entities[n] ?? m);

function visibleText(html) {
  const body = html.replace(/^[\s\S]*?<body[^>]*>/i, "").replace(/<\/body>[\s\S]*$/i, "");
  return decode(
    body
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<(script|style|header|footer|svg|template)\b[\s\S]*?<\/\1>/gi, "")
      .replace(/<[^>]+>/g, "\n"),
  )
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function resolves(href) {
  const path = href.split(/[?#]/)[0].slice(BASE.length) || "/";
  const target = join(root, path);
  return (
    (existsSync(target) && statSync(target).isFile()) ||
    existsSync(join(target, "index.html")) ||
    existsSync(target + ".html")
  );
}

const broken = new Set();
const files = walk(root).sort();
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const route = "/" + relative(root, file).replace(/index\.html$/, "");
  console.log(`=== ${route}`);
  for (const line of visibleText(html)) console.log(line);
  for (const [, href] of html.matchAll(/\shref="([^"]+)"/g)) {
    if (href.startsWith(BASE) && !resolves(href)) broken.add(`${route} -> ${href}`);
  }
}
console.log("=== UNRESOLVED INTERNAL LINKS");
for (const b of [...broken].sort()) console.log(b);
