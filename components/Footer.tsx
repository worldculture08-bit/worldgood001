import Link from "next/link";
import AdSlot from "@/components/AdSlot";
import { siteConfig } from "@/lib/site";
import {
  DEFAULT_LANG,
  aboutPath,
  contactPath,
  homePath,
  privacyPath,
  termsPath,
  t,
  type Lang,
} from "@/lib/i18n";

export default function Footer({ lang = DEFAULT_LANG }: { lang?: Lang }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-ink-200 bg-ink-50">
      {/* 전 페이지 공통 광고 자리 — 단위 ID가 없으면 AdSlot 이 알아서 숨긴다. */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <AdSlot slot="footer" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink-700 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} {siteConfig.name} · {siteConfig.author}
        </p>
        <nav
          className="flex flex-wrap gap-x-4 gap-y-1 text-ink-700/70"
          aria-label={t(lang, "footerTerms")}
        >
          {/* 고정 문서(소개·문의·약관)는 번역본이 준비될 때까지 한국어 경로로 연결한다 */}
          <Link href={aboutPath(DEFAULT_LANG)} className="hover:text-accent">
            {t(lang, "navAbout")}
          </Link>
          <Link href={contactPath(DEFAULT_LANG)} className="hover:text-accent">
            {t(lang, "footerContact")}
          </Link>
          <Link href="/editorial-policy" className="hover:text-accent">
            편집정책
          </Link>
          <Link href={privacyPath(DEFAULT_LANG)} className="hover:text-accent">
            {t(lang, "footerPrivacy")}
          </Link>
          <Link href={termsPath(DEFAULT_LANG)} className="hover:text-accent">
            {t(lang, "footerTerms")}
          </Link>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <p className="text-xs text-ink-700/60">{t(lang, "footerRights")}</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-700/60">
          이 사이트는{" "}
          <Link href={homePath(DEFAULT_LANG)} className="underline underline-offset-2">
            광고와 제휴 링크
          </Link>
          로 수익을 얻습니다. 광고는 본문과 분리된 영역에만 게재되며, 글을 쓴
          회사나 제품을 쓰거나 추천하는 대가로 돈을 받지 않습니다. 자세한 기준은{" "}
          <Link href="/editorial-policy" className="underline underline-offset-2">
            편집정책
          </Link>
          을 확인해 주세요.
        </p>
      </div>
    </footer>
  );
}