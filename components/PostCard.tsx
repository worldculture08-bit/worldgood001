import Link from "next/link";
import { categoryLabel } from "@/lib/categories";
import { formatDate, type PostMeta } from "@/lib/posts";
import { DEFAULT_LANG, categoryPath, postPath, type Lang } from "@/lib/i18n";

export default function PostCard({ post, lang = DEFAULT_LANG }: { post: PostMeta; lang?: Lang }) {
  return (
    <article className="group relative flex gap-4 rounded-xl border border-ink-200 bg-white p-5 shadow-sm transition hover:border-accent/40 hover:shadow-md sm:gap-5 sm:p-6">
      {post.image ? (
        <Link
          href={postPath(post.slug, lang)}
          className="relative z-10 hidden shrink-0 overflow-hidden rounded-lg border border-ink-100 sm:block"
          tabIndex={-1}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt=""
            width={128}
            height={128}
            loading="lazy"
            className="h-28 w-32 object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        {post.categories.length > 0 ? (
          <Link
            href={categoryPath(post.categories[0], lang)}
            className="relative z-10 rounded-full bg-ink-900 px-2.5 py-0.5 text-xs font-medium text-white hover:bg-accent"
          >
            {categoryLabel(post.categories[0], lang)}
          </Link>
        ) : null}
        <time
          dateTime={post.date}
          className="text-xs font-medium uppercase tracking-wide text-ink-700/60"
        >
          {formatDate(post.date, lang)}
        </time>
      </div>
      <h2 className="mt-2 font-serif text-xl font-semibold text-ink-900 group-hover:text-accent sm:text-2xl">
        <Link href={postPath(post.slug, lang)} className="focus:outline-none">
          <span className="absolute inset-0 rounded-xl" aria-hidden />
          {post.title}
        </Link>
      </h2>
      {post.description ? (
        <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-ink-700 sm:text-base">
          {post.description}
        </p>
      ) : null}
      {post.tags.length > 0 ? (
        <ul className="relative mt-4 flex flex-wrap gap-2">
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
      </div>
    </article>
  );
}
