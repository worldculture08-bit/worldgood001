import Link from "next/link";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 max-w-2xl">
        <p className="text-sm font-medium text-accent">블로그</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {siteConfig.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-700 sm:text-lg">
          {siteConfig.tagline}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/about"
            className="rounded-md bg-accent px-4 py-2 font-semibold text-white hover:bg-accent/90"
          >
            이 공간 소개
          </Link>
          <span className="text-ink-700/70">현재 {posts.length}편의 기록</span>
        </div>
      </section>

      <div className="mb-10">
        <AdSlot slot="banner" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
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
            posts.map((post) => (
              <div key={post.slug} className="relative">
                <PostCard post={post} />
              </div>
            ))
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-ink-900">
              이 블로그에 대해
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              현장형 기획자 {siteConfig.author}이 사람과 일을 잇고, 경험을 글로
              남기는 공간입니다.
            </p>
            <Link
              href="/about"
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              소개 더 보기 →
            </Link>
          </div>
          <AdSlot slot="sidebar" />
        </aside>
      </div>
    </div>
  );
}
