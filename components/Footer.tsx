import Link from "next/link";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-ink-200 bg-ink-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink-700 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} {siteConfig.name} · {siteConfig.author}
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-ink-700/70" aria-label="사이트 안내">
          <Link href="/about" className="hover:text-accent">소개</Link>
          <Link href="/contact" className="hover:text-accent">문의</Link>
          <Link href="/privacy" className="hover:text-accent">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-accent">이용약관</Link>
        </nav>
      </div>
    </footer>
  );
}
