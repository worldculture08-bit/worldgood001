import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DEFAULT_LANG, TARGET_LANGS, isLang, type Lang } from "@/lib/i18n";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return TARGET_LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang) || lang === DEFAULT_LANG) notFound();

  return (
    <>
      <Header lang={lang as Lang} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang as Lang} />
    </>
  );
}