import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import NewsletterForm from "@/components/NewsletterForm";
import { categoryLabel } from "@/lib/categories";
import {
  formatDateKo,
  getAllCategories,
  getPostsByCategory,
  isValidCategory,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { LANGS, langPrefix, type Lang } from "@/lib/i18n";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  if (!isValidCategory(category)) return { title: "카테고리를 찾을 수 없습니다" };
  const label = categoryLabel(category);
  const count = getPostsByCategory(category).length;
  return {
    title: `${label} 글 목록`,
    description: `${label} 주제의 기록 ${count}편 — 하루기록에서 모은 실전 노트와 판단 기준입니다.`,
    alternates: {
      canonical: `/c/${category}`,
      languages: Object.fromEntries(
        LANGS.map((l) => [l, `${langPrefix(l as Lang)}/c/${category}`]),
      ),
    },
    openGraph: {
      title: `${label} 글 목록 · 하루기록`,
      description: `${label} 주제의 기록 ${count}편`,
      url: `${siteConfig.url}/c/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();

  const label = categoryLabel(category);
  const posts = getPostsByCategory(category);
  const all = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="text-sm text-ink-700/70">
        <Link href="/" className="hover:text-accent">
          ← 글 목록
        </Link>
      </nav>

      <header className="mt-6 border-b border-ink-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Category
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {label}
        </h1>
        <p className="mt-3 text-base text-ink-700">
          이 주제의 기록 {posts.length}편
          {posts[0] ? ` · 가장 최근: ${formatDateKo(posts[0].date)}` : ""}
        </p>
      </header>

      {/* 카테고리 전체 내비게이션 */}
      <nav aria-label="카테고리 목록" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {all.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/c/${c.slug}`}
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
        {posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink-200 bg-white p-8 text-center text-ink-700">
            아직 이 카테고리의 글이 없습니다.
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>

      <div className="mt-10">
        <NewsletterForm source={`category:${category}`} />
      </div>

      <nav className="mt-12 border-t border-ink-200 pt-8">
        <Link href="/" className="text-sm font-medium text-accent hover:underline">
          ← 모든 글 보기
        </Link>
      </nav>
    </div>
  );
}
