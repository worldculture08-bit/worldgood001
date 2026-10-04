import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import { categoryLabel } from "@/lib/categories";
import { formatDate, getAllCategories, getPostsByCategory, isValidCategory } from "@/lib/posts";
import {
  DEFAULT_LANG,
  TARGET_LANGS,
  categoryPath,
  homePath,
  isLang,
  t,
  type Lang,
} from "@/lib/i18n";

type Props = {
  params: Promise<{ lang: string; category: string }>;
};

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  if (!isLang(lang) || lang === DEFAULT_LANG) return { title: "카테고리를 찾을 수 없습니다" };
  const L = lang as Lang;
  if (!isValidCategory(category, L)) return { title: "카테고리를 찾을 수 없습니다" };

  const label = categoryLabel(category, L);
  const count = getPostsByCategory(category, L).length;

  const languages: Record<string, string> = {
    ko: `/c/${category}`,
    "x-default": `/c/${category}`,
  };
  for (const l of TARGET_LANGS) languages[l] = `/${l}/c/${category}`;

  return {
    title: `${label}`,
    description: `${label} · ${count}`,
    alternates: { canonical: categoryPath(category, L), languages },
  };
}

export default async function LangCategoryPage({ params }: Props) {
  const { lang, category } = await params;
  if (!isLang(lang) || lang === DEFAULT_LANG) notFound();
  const L = lang as Lang;
  if (!isValidCategory(category, L)) notFound();

  const label = categoryLabel(category, L);
  const posts = getPostsByCategory(category, L);
  const all = getAllCategories(L);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="text-sm text-ink-700/70">
        <Link href={homePath(L)} className="hover:text-accent">
          {t(L, "backToList")}
        </Link>
      </nav>

      <header className="mt-6 border-b border-ink-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Category</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {label}
        </h1>
        <p className="mt-3 text-base text-ink-700">
          {t(L, "postsInCategory")} {posts.length}
          {posts[0] ? ` · ${formatDate(posts[0].date, L)}` : ""}
        </p>
      </header>

      <nav aria-label={t(L, "categoriesTitle")} className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {all.map((c) => (
            <li key={c.slug}>
              <Link
                href={categoryPath(c.slug, L)}
                className={
                  c.slug === category
                    ? "rounded-full bg-ink-900 px-3 py-1 text-sm font-medium text-white"
                    : "rounded-full border border-ink-200 bg-white px-3 py-1 text-sm text-ink-800 hover:border-accent hover:text-accent"
                }
              >
                {c.label} <span className="text-xs text-ink-700/60">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8">
        <AdSlot slot="banner" />
      </div>

      <div className="mt-8 space-y-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} lang={L} />
        ))}
      </div>

      <nav className="mt-12 border-t border-ink-200 pt-8">
        <Link href={homePath(L)} className="text-sm font-medium text-accent hover:underline">
          {t(L, "allPosts")}
        </Link>
      </nav>
    </div>
  );
}