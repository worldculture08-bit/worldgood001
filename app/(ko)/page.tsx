import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import NewsletterForm from "@/components/NewsletterForm";
import { monetizationScore } from "@/lib/categories";
import { getAllCategories, getAllPosts, getPostsByCategory } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { LANGS, langPrefix, type Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: Object.fromEntries(
      LANGS.map((l) => [l, langPrefix(l as Lang) || "/"]),
    ),
  },
};

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const latestPost = posts[0];

  // 수익 카테고리(전세·연금·세금·주거·투자)를 먼저 노출한다.
  // 방문자는 여기서 "내 돈 문제"를 찾고 들어오고, 광고 단가도 이 주제에 붙는다.
  const moneyCategories = categories
    .filter((c) => monetizationScore(c.slug) >= 3)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 max-w-3xl">
        <p className="text-sm font-medium text-accent">하루기록 · 현장 노트</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          하루를 기록하고,<br className="hidden sm:block" /> 다음 행동으로 바꾸는 공간
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
          {siteConfig.description} 현장의 작은 관찰과 AI 실무 실험을 다시 찾을 수 있는 글로 남깁니다.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href={latestPost ? `/p/${latestPost.slug}` : "/p/why-write"}
            className="rounded-md bg-accent px-4 py-2 font-semibold text-white hover:bg-accent/90"
          >
            {latestPost ? "최신 기록 읽기" : "첫 기록 읽기"}
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-ink-200 bg-white px-4 py-2 font-semibold text-ink-800 hover:border-accent hover:text-accent"
          >
            이 공간 소개
          </Link>
          <span className="text-ink-700/70">기록·실험 {posts.length}편</span>
        </div>
      </section>

      {/* 돈이 걸린 문제로 바로 가는 입구 — 검색 의도가 뚜렷해 유입과 전환율도 높다. */}
      {moneyCategories.length > 0 ? (
        <section className="mb-10" aria-labelledby="money-topics">
          <h2 id="money-topics" className="font-serif text-xl font-semibold text-ink-900">
            돈이 걸린 문제부터
          </h2>
          <p className="mt-1 text-sm text-ink-700">
            금액이 실제로 달라지는 주제입니다. 계산 과정을 전부 펼쳐 둡니다.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {moneyCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/c/${c.slug}`}
                  className="flex h-full flex-col rounded-xl border border-ink-200 bg-white p-4 transition hover:border-accent/50 hover:shadow-sm"
                >
                  <p className="text-sm font-semibold text-accent">
                    {c.label}{" "}
                    <span className="text-xs font-normal text-ink-700/60">{c.count}편</span>
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-800">
                    {getPostsByCategory(c.slug)[0]?.description ?? "계산과 비교표를 모아 둔 주제입니다."}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mb-10">
        <AdSlot slot="banner" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Latest notes
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink-900">최근 기록</h2>
            </div>
            <span className="text-sm text-ink-700/70">계속 쌓는 중</span>
          </div>
          <div className="space-y-5">
            {posts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-ink-200 bg-white p-8 text-center text-ink-700">
                아직 글이 없습니다.{" "}
                <code className="rounded bg-ink-100 px-1.5 py-0.5 text-sm">
                  content/posts
                </code>
                에 마크다운 파일을 추가해 보세요.
              </p>
            ) : (
              posts.map((post) => <PostCard key={post.slug} post={post} />)
            )}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <NewsletterForm source="home:sidebar" />
          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-ink-900">카테고리</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/c/${c.slug}`}
                    className="rounded-full border border-ink-200 bg-white px-3 py-1 text-sm text-ink-800 hover:border-accent hover:text-accent"
                  >
                    {c.label} <span className="text-xs text-ink-700/60">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-ink-900">
              이런 기록부터 보세요
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              하루의 기록, 현장의 판단, 노동과 사람의 문제, AI를 검증하는 방법을
              한곳에서 이어 봅니다.
            </p>
            <Link href="/p/why-write" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              왜 기록하는지 보기 →
            </Link>
          </div>
          <AdSlot slot="sidebar" />
        </aside>
      </div>
    </div>
  );
}