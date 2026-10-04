import Link from "next/link";
import { getSession } from "@/lib/auth";
import { siteConfig } from "@/lib/site";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { DEFAULT_LANG, aboutPath, homePath, t, type Lang } from "@/lib/i18n";

export default async function Header({ lang = DEFAULT_LANG }: { lang?: Lang }) {
  const session = await getSession();
  const isAdmin = session?.role === "admin";
  const isMember = !!session && session.role === "member";

  return (
    <header className="border-b border-ink-200 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href={homePath(lang)} className="group block min-w-0">
          <span className="block font-serif text-xl font-semibold tracking-tight text-ink-900 group-hover:text-accent sm:text-2xl">
            {siteConfig.name}
          </span>
          <span className="mt-0.5 block truncate text-xs text-ink-700/70 sm:text-sm">
            {siteConfig.tagline}
          </span>
        </Link>
        <nav className="flex shrink-0 flex-wrap items-center justify-end gap-1 text-sm font-medium text-ink-800 sm:gap-2">
          {/* 언어 전환 — 오른쪽 상단 첫 버튼 */}
          <LanguageSwitcher current={lang} />
          <Link
            href={homePath(lang)}
            className="rounded-md px-2.5 py-1.5 hover:bg-ink-100 hover:text-accent"
          >
            {t(lang, "navMain")}
          </Link>
          <Link
            href={aboutPath(lang)}
            className="rounded-md px-2.5 py-1.5 hover:bg-ink-100 hover:text-accent"
          >
            {t(lang, "navAbout")}
          </Link>
          {!session ? (
            <>
              <Link
                href="/join"
                className="rounded-md px-2.5 py-1.5 hover:bg-ink-100 hover:text-accent"
              >
                {t(lang, "navJoin")}
              </Link>
              <Link
                href="/login"
                className="rounded-md px-2.5 py-1.5 hover:bg-ink-100 hover:text-accent"
              >
                {t(lang, "navLogin")}
              </Link>
            </>
          ) : null}
          {isMember ? (
            <span className="hidden text-xs text-ink-700/70 sm:inline">
              {session.username}
            </span>
          ) : null}
          {isAdmin ? (
            <Link
              href="/admin"
              className="rounded-md bg-accent/10 px-2.5 py-1.5 text-accent hover:bg-accent/20"
            >
              {t(lang, "navAdmin")}
            </Link>
          ) : null}
          {session ? <LogoutButton /> : null}
        </nav>
      </div>
    </header>
  );
}