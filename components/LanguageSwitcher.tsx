"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LANGS, LANG_LABELS, LANG_SHORT, isLang, switchLangInPath, t, type Lang } from "@/lib/i18n";

export default function LanguageSwitcher({ current }: { current?: Lang }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  const segs = pathname.split("/").filter(Boolean);
  const active: Lang = current ?? (segs.length && isLang(segs[0]) ? segs[0] : "ko");

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t(active, "langLabel")}
        title={t(active, "langLabel")}
        className="flex items-center gap-1 rounded-md border border-ink-200 px-2 py-1.5 text-xs font-medium text-ink-800 hover:bg-ink-100 hover:text-accent"
      >
        {/* 글자 2개로 언어가 보이도록 */}
        <span aria-hidden className="text-[10px] leading-none">
          {LANG_SHORT[active]}
        </span>
        <span aria-hidden className="text-[10px] leading-none">
          ▾
        </span>
      </button>

      {open ? (
        <>
          {/* 바깥 클릭 시 닫기 */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-1 w-36 overflow-hidden rounded-md border border-ink-200 bg-white py-1 shadow-lg"
          >
            {LANGS.map((lang) => (
              <Link
                key={lang}
                role="menuitem"
                href={switchLangInPath(pathname, lang)}
                hrefLang={lang}
                onClick={() => setOpen(false)}
                className={
                  lang === active
                    ? "block bg-ink-100 px-3 py-2 text-sm font-semibold text-accent"
                    : "block px-3 py-2 text-sm text-ink-800 hover:bg-ink-100"
                }
              >
                {LANG_LABELS[lang]}
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}