import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import { categoryLabel, monetizationScore } from "@/lib/categories";
import { DEFAULT_LANG, LANG_LOCALE, type Lang } from "@/lib/i18n";

// content/posts/          → 한국어 원문
// content/posts/{lang}/   → 번역본 (en/ja/zh/es). 없으면 한국어 원문으로 대체하고 translated=false

const postsRoot = path.join(process.cwd(), "content/posts");
const postSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type AffiliateLink = {
  name: string;
  url: string;
  note?: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  /** frontmatter updated: — 법령·요율이 바뀌면 갱신한다. 없으면 빈 문자열 */
  updated: string;
  description: string;
  tags: string[];
  categories: string[];
  image: string;
  /** frontmatter affiliate: [{name,url,note}] — 없으면 빈 배열 */
  affiliate: AffiliateLink[];
  /** 번역본이 아니라 한국어 원문을 보여줄 때 false */
  translated: boolean;
};

const AFFILIATE_NAME_MAX = 80;
const AFFILIATE_URL_MAX = 500;

/** http/https 만 허용 — javascript: 같은 스킴이 frontmatter로 들어오면 안 된다. */
function safeHttpUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().slice(0, AFFILIATE_URL_MAX);
  if (!v) return null;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

function parseAffiliate(data: Record<string, unknown>): AffiliateLink[] {
  const raw = data.affiliate;
  if (!Array.isArray(raw)) return [];
  const out: AffiliateLink[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as Record<string, unknown>;
    const url = safeHttpUrl(rec.url);
    const name = typeof rec.name === "string" ? rec.name.trim().slice(0, AFFILIATE_NAME_MAX) : "";
    if (!url || !name) continue;
    const note =
      typeof rec.note === "string" ? rec.note.trim().slice(0, AFFILIATE_URL_MAX) : undefined;
    out.push({ name, url, note });
    if (out.length >= 6) break;
  }
  return out;
}

const coverSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// 커버 이미지 결정: frontmatter image → cover-<slug>.png → og-default
export function resolveCover(slug: string, data?: { image?: unknown }): string {
  const explicit = data && typeof data.image === "string" && data.image.trim();
  if (explicit) return explicit as string;
  if (coverSlugPattern.test(slug)) {
    const coverPath = path.join(process.cwd(), "public", "images", `cover-${slug}.png`);
    if (fs.existsSync(coverPath)) return `/images/cover-${slug}.png`;
  }
  return "/images/og-default.png";
}

export type Post = PostMeta & {
  contentHtml: string;
};

function listMd(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

function stripMd(file: string): string {
  return file.replace(/\.md$/, "");
}

function validSlug(slug: string): boolean {
  return postSlugPattern.test(slug);
}

/** 번역본 경로가 있으면 번역본, 없으면 null */
function translatedPath(slug: string, lang: Lang): string | null {
  if (lang === DEFAULT_LANG) return null;
  const p = path.join(postsRoot, lang, `${slug}.md`);
  return fs.existsSync(p) ? p : null;
}

/** 읽을 파일 경로: 번역본 우선, 없으면 한국어 */
function resolvePath(slug: string, lang: Lang): { file: string; translated: boolean } | null {
  const tr = translatedPath(slug, lang);
  if (tr) return { file: tr, translated: true };
  const ko = path.join(postsRoot, `${slug}.md`);
  if (fs.existsSync(ko)) return { file: ko, translated: false };
  return null;
}

/** 번역본이 있는 슬러그를 앞에, 나머지는 한국어 순으로 (최신순 정렬은 getAllPosts 에서) */
export function getAllPostSlugs(lang: Lang = DEFAULT_LANG): string[] {
  const koSlugs = listMd(postsRoot).map(stripMd).filter(validSlug);
  if (lang === DEFAULT_LANG) return koSlugs;
  const trSlugs = listMd(path.join(postsRoot, lang)).map(stripMd).filter(validSlug);
  const seen = new Set<string>();
  return [...trSlugs, ...koSlugs].filter((s) => (seen.has(s) ? false : (seen.add(s), true)));
}

function parseMeta(slug: string, file: string, translated: boolean): PostMeta {
  const fileContents = fs.readFileSync(file, "utf8");
  const { data } = matter(fileContents);
  return {
    slug,
    title: (data.title as string) || slug,
    date: (data.date as string) || "",
    updated: (data.updated as string) || "",
    description: (data.description as string) || "",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    categories: Array.isArray(data.categories) ? (data.categories as string[]) : [],
    image: resolveCover(slug, data),
    affiliate: parseAffiliate(data),
    translated,
  };
}

export function getAllPosts(lang: Lang = DEFAULT_LANG): PostMeta[] {
  const slugs = getAllPostSlugs(lang);
  const posts: PostMeta[] = [];
  for (const slug of slugs) {
    const r = resolvePath(slug, lang);
    if (!r) continue;
    posts.push(parseMeta(slug, r.file, r.translated));
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string, lang: Lang = DEFAULT_LANG): Promise<Post | null> {
  if (!validSlug(slug)) return null;
  const r = resolvePath(slug, lang);
  if (!r) return null;

  const fileContents = fs.readFileSync(r.file, "utf8");
  const { data, content } = matter(fileContents);
  const processed = await remark().use(remarkGfm).use(html, { sanitize: false }).process(content);
  const meta = parseMeta(slug, r.file, r.translated);

  return { ...meta, contentHtml: processed.toString() };
}

// 관련 글 추천 — 2단계
// 1순위: content/related.json — TypeSafe(Jev)가 의미적 관련성을 사전 판정한 결과
//        (scripts/build_related.py로 새 글 추가 시 재생성, 빌드 시 읽기만 하므로 비용 0)
// 2순위 fallback: 카테고리·태그 겹침 점수 (주 카테고리 +3, 카테고리 +1.5/개, 태그 +1/개)
const relatedCache = new Map<string, string[]>();

function loadRelatedMap(slug: string): string[] {
  const cached = relatedCache.get(slug);
  if (cached) return cached;
  let list: string[] = [];
  try {
    const p = path.join(process.cwd(), "content", "related.json");
    if (fs.existsSync(p)) {
      const map = JSON.parse(fs.readFileSync(p, "utf8")) as Record<string, string[]>;
      list = Array.isArray(map[slug]) ? map[slug] : [];
    }
  } catch {
    list = [];
  }
  relatedCache.set(slug, list);
  return list;
}

export function getRelatedPosts(slug: string, limit = 3, lang: Lang = DEFAULT_LANG): PostMeta[] {
  const posts = getAllPosts(lang);
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];
  const bySlug = new Map(posts.map((p) => [p.slug, p]));

  // 1순위: TypeSafe 사전 판정 결과
  const picked: PostMeta[] = [];
  for (const s of loadRelatedMap(slug)) {
    const p = bySlug.get(s);
    if (p && p.slug !== slug && !picked.includes(p)) picked.push(p);
    if (picked.length >= limit) return picked;
  }

  // 2순위: 카테고리·태그 겹침 점수로 채운다. 질의 글의 수익 잠재력을 가중치로 더해
  //         방문자를 돈을 써도 되는 주제(재테크·노동법)로 데려간다.
  const moneyBias = monetizationScore(current.categories[0] ?? "") * 2;
  const scoreOf = (p: PostMeta): number => {
    let s = moneyBias;
    if (p.categories[0] && p.categories[0] === current.categories[0]) s += 3;
    s += p.categories.filter((c) => current.categories.includes(c)).length * 1.5;
    s += p.tags.filter((t) => current.tags.includes(t)).length;
    return s;
  };
  const chosen = new Set(picked.map((p) => p.slug));
  const ranked = posts
    .filter((p) => p.slug !== slug && !chosen.has(p.slug))
    .map((p) => ({ p, s: scoreOf(p) }))
    .sort((a, b) => b.s - a.s || (a.p.date < b.p.date ? 1 : -1))
    .map((x) => x.p);
  while (picked.length < limit && ranked.length > 0) {
    picked.push(ranked.shift()!);
  }
  return picked;
}

export type CategoryInfo = { slug: string; label: string; count: number };

// 카테고리 목록 — 수익 잠재력(광고 단가) 우선, 같으면 글 많은 순
export function getAllCategories(lang: Lang = DEFAULT_LANG): CategoryInfo[] {
  const counts = new Map<string, number>();
  for (const p of getAllPosts(lang)) {
    for (const c of p.categories) counts.set(c, (counts.get(c) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, label: categoryLabel(slug, lang), count }))
    .sort(
      (a, b) =>
        monetizationScore(b.slug) - monetizationScore(a.slug) || b.count - a.count,
    );
}

export function getPostsByCategory(category: string, lang: Lang = DEFAULT_LANG): PostMeta[] {
  return getAllPosts(lang).filter((p) => p.categories.includes(category));
}

export function isValidCategory(category: string, lang: Lang = DEFAULT_LANG): boolean {
  return getAllCategories(lang).some((c) => c.slug === category);
}

export function formatDate(dateStr: string, lang: Lang = DEFAULT_LANG): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat(LANG_LOCALE[lang], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/** 기존 호출부 호환용 (한국어) */
export function formatDateKo(dateStr: string): string {
  return formatDate(dateStr, DEFAULT_LANG);
}