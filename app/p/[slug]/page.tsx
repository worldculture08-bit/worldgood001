import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import {
  formatDateKo,
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/posts";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
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
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `${siteConfig.url}/p/${post.slug}`,
    },
    alternates: { canonical: `/p/${post.slug}` },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-prose">
        <Link
          href="/"
          className="text-sm font-medium text-ink-700/70 hover:text-accent"
        >
          ← 글 목록
        </Link>

        <header className="mt-6 border-b border-ink-200 pb-8">
          <time dateTime={post.date} className="text-sm text-ink-700/60">
            {formatDateKo(post.date)}
          </time>
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

        <div
          className="prose-ko mt-8"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="my-10">
          <AdSlot slot="in-article" />
        </div>

        <nav className="border-t border-ink-200 pt-8">
          <Link
            href="/"
            className="text-sm font-medium text-accent hover:underline"
          >
            ← 다른 글 보기
          </Link>
        </nav>
      </div>
    </article>
  );
}
