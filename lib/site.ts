const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const siteConfig = {
  name: "하루기록",
  nameEn: "harugirok",
  tagline: "하루 기록 · 현장 인사이트 · AI 실무",
  description:
    "하루의 기록과 현장의 문제를 AI 실무·노동·사람의 시점에서 읽고, 다시 쓸 수 있게 정리하는 공간입니다.",
  author: "씩씩한 하루",
  url: (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl).replace(/\/+$/, ""),
  repositoryUrl: "https://github.com/worldculture08-bit/worldgood001",
};
