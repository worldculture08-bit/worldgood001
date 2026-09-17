import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description: `${siteConfig.author} — 현장형 기획자. 사람과 일을 잇고 글로 남깁니다.`,
  openGraph: {
    title: `소개 · ${siteConfig.name}`,
    description: `${siteConfig.author} — 현장형 기획자.`,
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
          안녕하세요. <strong>{siteConfig.author}</strong>입니다.
        </p>
        <p>
          현장형 기획자로, 사람과 일을 잇고 그 과정을 글로 남기려 합니다.
          이 블로그 <strong>{siteConfig.name}</strong>({siteConfig.nameEn})는
          현장에서 보고 들은 것, 만난 사람들, 노동과 일의 장면, 그리고 AI를
          실무에 붙이는 작은 실험을 모아 두는 공간입니다.
        </p>
        <p>
          거창한 전문가 선언보다는, 현장에서 천천히 배우고 정리하는 태도를
          지키려 합니다. 사실과 해석을 나누고, 짧은 기록이라도 남기는 쪽을
          택합니다. 읽으시는 분께 작은 단서나 공감이 닿으면 좋겠습니다.
        </p>
        <h2>이 블로그에서 다루는 것</h2>
        <ul>
          <li>현장 노트와 짧은 기록</li>
          <li>사람과 일을 잇는 기획 이야기</li>
          <li>노동·존중·신뢰가 보이는 장면</li>
          <li>AI·도구를 실무에 쓰는 현실적인 방법</li>
          <li>글을 쓰고 남기는 과정에 대한 생각</li>
        </ul>
        <p>
          회원 가입은 추천 코드가 필요합니다.{" "}
          <a href="/join">가입</a> · <a href="/login">로그인</a>
        </p>
        <h2>기록 원칙</h2>
        <p>
          공개 글에서는 확인한 사실, 누군가의 주장, 글쓴이의 해석을 가능한 한
          나누어 적습니다. 특정 개인이나 조직을 다룰 때는 불필요한 개인정보를
          공개하지 않고, 정정이 필요한 내용은 근거와 함께 검토합니다.
        </p>
        <p>
          글에 대한 문의나 수정 요청은 <a href="/contact">문의 페이지</a>에서
          보내 주세요.
        </p>
      </div>
    </div>
  );
}
