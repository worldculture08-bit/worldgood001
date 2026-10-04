import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import AdSlot from "@/components/AdSlot";
import { getAllCategories, getAllPosts } from "@/lib/posts";
import { DEFAULT_LANG, FEATURED, TARGET_LANGS, categoryPath, isLang, postPath, t, tCount, aboutPath, type Lang } from "@/lib/i18n";

type Props = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return TARGET_LANGS.map((lang) => ({ lang }));
}

export default async function LangHome({ params }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === DEFAULT_LANG) notFound();
  const L = lang as Lang;

  const posts = getAllPosts(L);
  const latestPost = posts[0];
  const categories = getAllCategories(L);
  const featured = FEATURED[L];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="mb-10 max-w-3xl">
        <p className="text-sm font-medium text-accent">{t(L, "homeKicker")}</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
          {t(L, "homeTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700 sm:text-lg">
          {t(L, "homeIntro")}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href={latestPost ? postPath(latestPost.slug, L) : postPath("why-write", L)}
            className="rounded-md bg-accent px-4 py-2 font-semibold text-white hover:bg-accent/90"
          >
            {latestPost ? t(L, "readLatest") : t(L, "readFirst")}
          </Link>
          <Link
            href={aboutPath(L)}
            className="rounded-md border border-ink-200 bg-white px-4 py-2 font-semibold text-ink-800 hover:border-accent hover:text-accent"
          >
            {t(L, "aboutSpace")}
          </Link>
          <span className="text-ink-700/70">{tCount(L, "postsCount", posts.length)}</span>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(([label, title, slug]) => (
            <Link
              key={slug}
              href={postPath(slug, L)}
              className="rounded-xl border border-ink-200 bg-white p-4 transition hover:border-accent/50 hover:shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">{label}</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-ink-800">{title}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mb-10">
        <AdSlot slot="banner" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Latest notes</p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink-900">{t(L, "latestNotes")}</h2>
            </div>
            <span className="text-sm text-ink-700/70">{t(L, "stillCollecting")}</span>
          </div>
          <div className="space-y-5">
            {posts.map((post) => (
              <div key={post.slug} className="relative">
                <PostCard post={post} lang={L} />
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-ink-900">{t(L, "categoriesTitle")}</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={categoryPath(c.slug, L)}
                    className="rounded-full border border-ink-200 bg-white px-3 py-1 text-sm text-ink-800 hover:border-accent hover:text-accent"
                  >
                    {c.label} <span className="text-xs text-ink-700/60">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-ink-900">{t(L, "startHere")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{t(L, "startHereBody")}</p>
            <Link href={postPath("why-write", L)} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              {t(L, "whyWrite")}
            </Link>
          </div>
          <AdSlot slot="sidebar" />
        </aside>
      </div>
    </div>
  );
}