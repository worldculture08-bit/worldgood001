import type { Metadata } from "next";
import AdSenseScript from "@/components/AdSenseScript";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    // 수익 관점: 검색 의도가 명확하고 광고 단가가 붙는 주제를 앞에 둔다.
    "전세",
    "전세금",
    "보증금",
    "월세",
    "연금저축",
    "연말정산",
    "소득세",
    "퇴직금",
    "실업급여",
    "부당해고",
    "산재보상",
    "하루기록",
    "하루 기록",
    "현장 기록",
    "노동",
    "일하는 사람",
    "AI 업무 자동화",
    "업무 자동화",
    "AI 도구 비교",
    "SaaS 도구",
  ],
  authors: [{ name: siteConfig.author }],
  other: {
    // Naver Search Advisor site verification (하루기록, account: 소똑)
    "naver-site-verification": "c2f35a5e7120a29cb7ac63dcf87140d065e89612",
    ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT
      ? { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT }
      : {}),
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Header·Footer 는 언어별 레이아웃((ko) 와 [lang])에서 렌더한다.
// 한국어/영어/일본어/중국어/스페인어가 섞이지 않도록 언어별로 분리했다.
export default function RootLayout(props: Readonly<{
  children: React.ReactNode;
}>) {
  // 사이트 전체 신원(Who/What) 신호 — E-E-A-T 의 가장 기본 단위.
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: "ko-KR",
        publisher: { "@id": `${siteConfig.url}#person` },
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}#person`,
        name: siteConfig.author,
        url: `${siteConfig.url}/about`,
        description:
          "노동법·임금 계산과 개인재테크 계산을 직접 정리해 쓰는 기록자.",
        knowsAbout: [
          "전세·보증금",
          "연금저축",
          "연말정산·소득세",
          "퇴직금·실업급여",
          "산재보상",
          "AI 업무 도구",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}#org`,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/images/og-default.png`,
        founder: { "@id": `${siteConfig.url}#person` },
      },
    ],
  };

  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <AdSenseScript />
        {props.children}
      </body>
    </html>
  );
}
