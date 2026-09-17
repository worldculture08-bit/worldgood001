import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description: `${siteConfig.author} — 일과 세상을 유쾌하게 읽는 기록자.`,
  openGraph: {
    title: `소개 · ${siteConfig.name}`,
    description: `${siteConfig.author} — 일과 세상사를 유쾌하게 읽는 기록자.`,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium text-accent">About</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
        소개
      </h1>

      <div className="prose-ko mt-8">
        <p>
          안녕하세요. 하루기록을 쓰는 <strong>{siteConfig.author}</strong>
          입니다. 하루하루 부지런히 일하고, 에너지 넘치게 긍정적인 사람입니다.
        </p>
        <p>
          아침마다 노트를 폅니다. 오늘 만날 사람, 오늘 꼭 끝낼 일 하나, 그리고
          요즘 세상이 돌아가는 이야기 한 줄. 그렇게 쌓인 하루가 모여 이 블로그가
          됩니다. 이름은 <strong>{siteConfig.name}</strong>
          ({siteConfig.nameEn}), 뜻은 단순합니다. <span className="em-warm">잘 살아낸 하루는 기록해 둘 가치가 있다</span>
          는 것.
        </p>
        <p>
          일에 관한 이야기를 좋아합니다. 일자리, 산업, 교육, 돈, 그리고 AI가
          바꿔 놓는 일의 풍경까지. 어렵게 쓰지 않으려 합니다. 사무실에서, 현장에서,
          밥상에서 나눌 수 있는 말로 세상을 읽어 보려 합니다.
        </p>
        <h2>여기서 다루는 것</h2>
        <ul>
          <li>오늘의 이슈를 내 언어로 다시 읽기 (경제·산업·국제)</li>
          <li>일과 노동의 미래 — AI, 기본소득, 고용</li>
          <li>교육과 아이들, 그리고 우리가 계속 배워야 하는 것들</li>
          <li>돈과 투자에 대한 솔직한 생각</li>
          <li>하루를 잘 보내는 작은 습관들</li>
        </ul>
        <blockquote>
          힘든 뉴스가 많아도 사람은 결국 일하고, 배우고, 웃으면서 앞으로 갑니다.
          이 블로그는 그 증거를 한 줄씩 모으는 곳입니다.
        </blockquote>
        <h2>기록 원칙</h2>
        <p>
          공개 글에서는 확인한 사실, 누군가의 주장, 글쓴이의 생각을 가능한 한
          나누어 적습니다. 특정 개인이나 조직을 다룰 때는 불필요한 개인정보를
          공개하지 않고, 정정이 필요한 내용은 근거와 함께 검토합니다.
        </p>
        <p>
          글에 대한 문의나 수정 요청은 <a href="/contact">문의 페이지</a>에서
          보내 주세요. 회원 가입은 추천 코드가 필요합니다.{" "}
          <a href="/join">가입</a> · <a href="/login">로그인</a>
        </p>
      </div>
    </div>
  );
}
