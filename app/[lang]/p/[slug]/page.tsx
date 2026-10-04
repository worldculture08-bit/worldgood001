import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { categoryLabel } from "@/lib/categories";
import { formatDate, getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import {
  DEFAULT_LANG,
  TARGET_LANGS,
  categoryPath,
  homePath,
  isLang,
  notTranslatedNote,
  postPath,
  t,
  type Lang,
} from "@/lib/i18n";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang) || lang === DEFAULT_LANG) return { title: "글을 찾을 수 없습니다" };
  const L = lang as Lang;
  const post = await getPostBySlug(slug, L);
  if (!post) return { title: "글을 찾을 수 없습니다" };

  const languages: Record<string, string> = {
    ko: `/p/${post.slug}`,
    "x-default": `/p/${post.slug}`,
  };
  for (const l of TARGET_LANGS) languages[l] = `/${l}/p/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteConfig.url}/p/${post.slug}`,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: { canonical: postPath(post.slug, L), languages },
  };
}

export default async function LangPostPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLang(lang) || lang === DEFAULT_LANG) notFound();
  const L = lang as Lang;

  const post = await getPostBySlug(slug, L);
  if (!post) notFound();
  const related = getRelatedPosts(slug, 3, L);
  const note = post.translated ? "" : notTranslatedNote(L);

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-prose">
        <Link href={homePath(L)} className="text-sm font-medium text-ink-700/70 hover:text-accent">
          {t(L, "backToList")}
        </Link>

        {note ? (
          <p className="mt-4 rounded-lg border border-accent/30 bg-accent-soft px-4 py-2.5 text-sm text-accent">
            {note}
          </p>
        ) : null}

        <header className="mt-6 border-b border-ink-200 pb-8">
          {post.categories.length > 0 ? (
            <ul className="mb-3 flex flex-wrap gap-2">
              {post.categories.map((c) => (
                <li key={c}>
                  <Link
                    href={categoryPath(c, L)}
                    className="rounded-full bg-ink-900 px-2.5 py-0.5 text-xs font-medium text-white hover:bg-accent"
                  >
                    {categoryLabel(c, L)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-700/70">
            <time dateTime={post.date}>{formatDate(post.date, L)}</time>
            <span aria-hidden>·</span>
            <span>
              {t(L, "writtenBy")}{" "}
              <Link href={`${L === DEFAULT_LANG ? "" : `/${L}`}/about`} className="font-medium text-ink-800 hover:text-accent">
                {siteConfig.author}
              </Link>
            </span>
            <span aria-hidden>·</span>
            <span>{t(L, "humanReviewed")}</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.description ? (
            <p className="mt-4 text-lg leading-relaxed text-ink-700">{post.description}</p>
          ) : null}
          {post.tags.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        {post.image ? (
          <figure className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={`${post.title}`}
              width={1200}
              height={630}
              className="w-full rounded-xl border border-ink-100 object-cover"
            />
          </figure>
        ) : null}

        <div className="prose-ko mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        <div className="my-10">
          <AdSlot slot="in-article" />
        </div>

        {related.length > 0 ? (
          <section className="mb-10" aria-label={t(L, "relatedPosts")}>
            <h2 className="font-serif text-xl font-semibold text-ink-900">{t(L, "relatedPosts")}</h2>
            <ul className="mt-4 space-y-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={postPath(p.slug, L)}
                    className="block rounded-xl border border-ink-200 bg-white p-4 transition hover:border-accent/40 hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {p.categories[0] ? (
                        <span className="rounded-full bg-ink-900 px-2 py-0.5 text-xs font-medium text-white">
                          {categoryLabel(p.categories[0], L)}
                        </span>
                      ) : null}
                      <time dateTime={p.date} className="text-xs text-ink-700/60">
                        {formatDate(p.date, L)}
                      </time>
                    </div>
                    <p className="mt-1.5 font-medium text-ink-900">{p.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <nav className="border-t border-ink-200 pt-8">
          <Link href={homePath(L)} className="text-sm font-medium text-accent hover:underline">
            {t(L, "allPosts")}
          </Link>
        </nav>
      </div>
    </article>
  );
}