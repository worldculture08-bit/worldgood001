// make-covers.mjs — 글마다 대표 이미지(1200x630)를 자동 생성한다.
// 방식: SVG(제목 텍스트)를 Chrome headless로 스크린샷 → PNG. 외부 이미지 0 사용(라이선스 안전).
// 사용: node scripts/make-covers.mjs  (repo 루트에서 실행)
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS = path.join(ROOT, "content/posts");
const OUT = path.join(ROOT, "public/images");
const WIDTH = 1200;
const HEIGHT = 630;

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  path.join(process.env.LOCALAPPDATA || "", "Google/Chrome/Application/chrome.exe"),
];

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
}

const PALETTES = [
  { a: "#f7f1e5", b: "#e8dcc6", ink: "#2b2620", accent: "#b4552d" },
  { a: "#eef3f0", b: "#dbe7df", ink: "#24322a", accent: "#2f7d5d" },
  { a: "#f3eef7", b: "#e2d8ec", ink: "#332a3d", accent: "#7a5195" },
  { a: "#f7f0ee", b: "#ecdcd6", ink: "#3a2a24", accent: "#b04a3a" },
  { a: "#eef2f7", b: "#dae2ee", ink: "#22304a", accent: "#3465a4" },
  { a: "#f6f4ea", b: "#e8e4cf", ink: "#33311f", accent: "#8a7a2e" },
];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 한글 제목을 14자 단위로 줄바꿈 (최대 3줄)
function wrapTitle(t, per = 14, maxLines = 3) {
  const clean = String(t).replace(/\s+/g, " ").trim();
  const lines = [];
  for (let i = 0; i < clean.length && lines.length < maxLines; i += per) {
    lines.push(clean.slice(i, i + per));
  }
  if (clean.length > per * maxLines) {
    lines[maxLines - 1] = lines[maxLines - 1].slice(0, per - 1) + "…";
  }
  return lines;
}

function svgFor(title, date, tag, slug) {
  const p = PALETTES[hash(slug) % PALETTES.length];
  const lines = wrapTitle(title);
  const fs1 = lines.some((l) => l.length > 11) ? 54 : 62;
  const lh = fs1 * 1.32;
  const startY = 250 + (2 - lines.length) * (lh / 2);
  const tspans = lines
    .map((l, i) => `<tspan x="90" y="${startY + i * lh}">${esc(l)}</tspan>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.a}"/>
      <stop offset="1" stop-color="${p.b}"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="1050" cy="150" r="330" fill="#ffffff" opacity="0.22"/>
  <circle cx="940" cy="560" r="240" fill="#000000" opacity="0.035"/>
  <rect x="90" y="96" width="46" height="8" rx="4" fill="${p.accent}"/>
  <text x="90" y="150" font-family="'Malgun Gothic','Apple SD Gothic Neo',sans-serif" font-size="26" font-weight="700" fill="${p.accent}">하루기록</text>
  ${tag ? `<text x="1110" y="150" text-anchor="end" font-family="'Malgun Gothic',sans-serif" font-size="22" fill="${p.ink}" opacity="0.55">${esc(tag)}</text>` : ""}
  <text font-family="'Malgun Gothic','Apple SD Gothic Neo',sans-serif" font-size="${fs1}" font-weight="700" fill="${p.ink}">${tspans}</text>
  <text x="90" y="560" font-family="'Malgun Gothic',sans-serif" font-size="22" fill="${p.ink}" opacity="0.55">${esc(date)}</text>
</svg>`;
}

function htmlShell(svg) {
  return `<!doctype html><meta charset="utf-8"><style>*{margin:0;padding:0}html,body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}</style>${svg}`;
}

function shoot(chrome, htmlFile, pngFile) {
  const url = "file:///" + htmlFile.replace(/\\/g, "/");
  const r = spawnSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      `--window-size=${WIDTH},${HEIGHT}`,
      `--screenshot=${pngFile}`,
      "--default-background-color=FFFFFFFF",
      url,
    ],
    { timeout: 30000 }
  );
  return r.status === 0 && fs.existsSync(pngFile);
}

const chrome = findChrome();
if (!chrome) {
  console.error("Chrome not found");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const tmp = path.join(ROOT, ".cover-tmp");
fs.mkdirSync(tmp, { recursive: true });

const files = fs.readdirSync(POSTS).filter((f) => f.endsWith(".md"));
let made = 0;
let skipped = 0;

for (const f of files) {
  const slug = f.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS, f), "utf8");
  const { data, content } = matter(raw);

  // 본문에 이미지가 있으면 건너뜀 (이미 커버가 있는 글)
  if (/<img[^>]+src=/.test(content)) {
    skipped++;
    continue;
  }

  const png = path.join(OUT, `cover-${slug}.png`);
  if (fs.existsSync(png) && process.argv.includes("--reuse")) {
    skipped++;
    continue;
  }

  const title = data.title || slug;
  const date = (data.date || "").slice(0, 10);
  const tag = Array.isArray(data.tags) && data.tags.length ? data.tags[0] : "";
  const svg = svgFor(title, date, tag, slug);

  const htmlFile = path.join(tmp, `${slug}.html`);
  fs.writeFileSync(htmlFile, htmlShell(svg), "utf8");

  if (shoot(chrome, htmlFile, png)) {
    made++;
    console.log(`ok  ${slug}`);
  } else {
    console.error(`FAIL ${slug}`);
  }
}

// 사이트 기본 커버 (og-default)
{
  const svg = svgFor("하루의 기록이 사람을 남깁니다", "하루·사람·기록", "하루기록", "og-default-seed");
  const htmlFile = path.join(tmp, "og-default.html");
  fs.writeFileSync(htmlFile, htmlShell(svg), "utf8");
  if (shoot(chrome, htmlFile, path.join(OUT, "og-default.png"))) {
    console.log("ok  og-default");
  }
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\ndone: ${made} created, ${skipped} skipped`);
