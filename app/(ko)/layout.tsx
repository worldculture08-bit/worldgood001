import Header from "@/components/Header";
import Footer from "@/components/Footer";

// 한국어(기본) 경로 전용 레이아웃 — 언어 버튼은 Header 안에서 동작한다.
export default function KoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header lang="ko" />
      <main className="flex-1">{children}</main>
      <Footer lang="ko" />
    </>
  );
}