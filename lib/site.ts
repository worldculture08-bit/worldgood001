const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const siteConfig = {
  name: "하루기록",
  nameEn: "harugirok",
  tagline: "하루·사람·기록",
  description:
    "하루하루의 경험을 기록으로 남기는 블로그. 씩씩한 하루의 기록 노트.",
  author: "씩씩한 하루",
  url: (process.env.NEXT_PUBLIC_SITE_URL || vercelUrl).replace(/\/+$/, ""),
  repositoryUrl: "https://github.com/worldculture08-bit/worldgood001",
};
