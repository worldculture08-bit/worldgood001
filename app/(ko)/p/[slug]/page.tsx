import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import AffiliateBlock from "@/components/AffiliateBlock";
import NewsletterForm from "@/components/NewsletterForm";
import { splitArticleHtml } from "@/lib/ads";
import { categoryLabel } from "@/lib/categories";
import {
  formatDateKo,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { LANGS, langPrefix, type Lang } from "@/lib/i18n";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

/** 같은 글의 다른 언어 주소 — hreflang 이 없으면 다국어 SEO 가 통째로 무력화된다. */
function languageAlternates(slug: string): Record<string, string> {
  const out: Record<string, string> = { "x-default": `/p/${slug}` };
  for (const l of LANGS) out[l] = `${langPrefix(l as Lang)}/p/${slug}`;
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "글을 찾을 수 없습니다" };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: siteConfig.author, url: "/about" }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      authors: [siteConfig.author],
      url: `${siteConfig.url}/p/${post.slug}`,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    alternates: {
      canonical: `/p/${post.slug}`,
      languages: languageAlternates(post.slug),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug, 3);

  // 광고가 실제로 들어갈 때만 본문을 자른다. 미설정이면 한 번에 그린다.
  const [head, tail] = splitArticleHtml(post.contentHtml);
  const moneySlug = post.categories[0] ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${siteConfig.url}/p/${post.slug}#article`,
        mainEntityOfPage: `${siteConfig.url}/p/${post.slug}`,
        headline: post.title,
        description: post.description,
        image: `${siteConfig.url}${post.image}`,
        datePublished: post.date,
        dateModified: post.updated || post.date,
        author: {
          "@type": "Person",
          name: siteConfig.author,
          url: `${siteConfig.url}/about`,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        articleSection: post.categories[0] ? categoryLabel(post.categories[0]) : undefined,
        keywords: post.tags.join(", ") || undefined,
        inLanguage: "ko-KR",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: siteConfig.url },
          ...(post.categories[0]
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: categoryLabel(post.categories[0]),
                  item: `${siteConfig.url}/c/${post.categories[0]}`,
                },
              ]
            : []),
          {
            "@type": "ListItem",
            position: post.categories[0] ? 3 : 2,
            name: post.title,
            item: `${siteConfig.url}/p/${post.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-prose">
        <Link
          href="/"
          className="text-sm font-medium text-ink-700/70 hover:text-accent"
        >
          ← 글 목록
        </Link>

        <header className="mt-6 border-b border-ink-200 pb-8">
          {post.categories.length > 0 ? (
            <ul className="mb-3 flex flex-wrap gap-2">
              {post.categories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/c/${c}`}
                    className="rounded-full bg-ink-900 px-2.5 py-0.5 text-xs font-medium text-white hover:bg-accent"
                  >
                    {categoryLabel(c)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-700/70">
            <time dateTime={post.date}>{formatDateKo(post.date)}</time>
            {post.updated ? (
              <>
                <span aria-hidden>·</span>
                <span>
                  <time dateTime={post.updated}>{formatDateKo(post.updated)} 수정</time>
                </span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>
              글쓴이{" "}
              <Link href="/about" className="font-medium text-ink-800 hover:text-accent">
                {siteConfig.author}
              </Link>
            </span>
            <span aria-hidden>·</span>
            <span>사람 검토 후 게시</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.description ? (
            <p className="mt-4 text-lg leading-relaxed text-ink-700">
              {post.description}
            </p>
          ) : null}
          {post.tags.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent"
                >
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
              alt={`${post.title} 대표 이미지`}
              width={1200}
              height={630}
              className="w-full rounded-xl border border-ink-100 object-cover"
            />
          </figure>
        ) : null}

        {head ? (
          <div
            className="prose-ko mt-8"
            dangerouslySetInnerHTML={{ __html: head }}
          />
        ) : null}

        {/* 본문 중간 광고 — 글 하단에만 두면 평당 수익이 붙지 않는다. */}
        <div className="my-10">
          <AdSlot slot="in-article" />
        </div>

        <div
          className="prose-ko"
          dangerouslySetInnerHTML={{ __html: tail }}
        />

        {post.affiliate.length > 0 ? (
          <AffiliateBlock links={post.affiliate} />
        ) : null}

        <div className="my-10">
          <AdSlot slot="in-article-2" />
        </div>

        {/* E-E-A-T: 누가, 무엇을 근거로 썼는지 본문 아래에서 바로 확인하게 한다. */}
        <aside className="mt-8 rounded-xl border border-ink-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Verified
          </p>
          <h2 className="mt-1 font-serif text-base font-semibold text-ink-900">
            이 글을 쓴 사람과 근거
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            글쓴이 <strong>{siteConfig.author}</strong> 님이 직접 작성하고 게시 전에
            검토했습니다. 금액·요율·법령은 기준일을 함께 적었으므로 시점이 다르면
            달라질 수 있습니다. 계산 예시는 실제 계약을 대체하지 않습니다.
          </p>
          <p className="mt-2 text-sm text-ink-700">
            오류를 발견하면{" "}
            <Link href="/contact" className="font-medium text-accent hover:underline">
              문의 페이지
            </Link>
            로 알려 주세요. 확인 후 고치고 수정일을 남깁니다. 작성 기준은{" "}
            <Link href="/editorial-policy" className="font-medium text-accent hover:underline">
              편집정책
            </Link>
            에 정리해 두었습니다.
          </p>
        </aside>

        <NewsletterForm source={`post:${post.slug}`} className="mt-8" />

        {related.length > 0 ? (
          <section className="mb-10 mt-10" aria-label="관련 글">
            <h2 className="font-serif text-xl font-semibold text-ink-900">
              관련 글
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/p/${p.slug}`}
                    className="block rounded-xl border border-ink-200 bg-white p-4 transition hover:border-accent/40 hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {p.categories[0] ? (
                        <span className="rounded-full bg-ink-900 px-2 py-0.5 text-xs font-medium text-white">
                          {categoryLabel(p.categories[0])}
                        </span>
                      ) : null}
                      <time dateTime={p.date} className="text-xs text-ink-700/60">
                        {formatDateKo(p.date)}
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
          <Link
            href={moneySlug ? `/c/${moneySlug}` : "/"}
            className="text-sm font-medium text-accent hover:underline"
          >
            ← 같은 주제의 다른 글 보기
          </Link>
        </nav>
      </div>
    </article>
  );
}