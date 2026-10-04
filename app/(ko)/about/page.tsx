import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description: `${siteConfig.author}의 AI 업무 자동화와 도구 선택 실험 기록.`,
  openGraph: {
    title: `소개 · ${siteConfig.name}`,
    description: `${siteConfig.author}의 AI 업무 자동화와 도구 선택 실험 기록.`,
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
          입니다. 일과 사람을 더 잘 이해하기 위해 AI와 도구를 실제 업무에
          적용해 보는 실험을 기록합니다.
        </p>
        <p>
          이 블로그는 AI 도구를 한 번 시도하고 끝내지 않고, 실제로 어떤 업무에
          붙였는지와 어디까지 검증했는지 기록합니다. 자동화가 사람의 판단을
          대신한다는 주장을 하지 않고, 판단과 책임은 사람이 가진다는 원칙을
          지킵니다.
        </p>
        <p>
          주제는 AI 업무 자동화, 도구 비교, 기록과 재사용, 현장에서 바로
          적용하는 작은 실험으로 좁혔습니다. 수익성, 비용, 도입 후 체감
          효과를 비교할 때도 확인하지 않은 숫자를 사실처럼 쓰지 않습니다.
        </p>
        <h2>여기서 다루는 것</h2>
        <ul>
          <li>회의록·이메일·보고서 초안을 빠르게 만드는 방법</li>
          <li>업무에 맞는 AI·SaaS 도구를 고르는 기준</li>
          <li>반복 작업을 줄이는 자동화 실험과 비용 비교</li>
          <li>현장 노트를 다시 찾을 수 있게 정리하는 방법</li>
          <li>AI 결과를 검토하고 공개하는 체크리스트</li>
        </ul>
        <blockquote>
          좋은 도구는 일을 대신하는 도구가 아니라, 사람이 판단하기 쉬운 형태로
          다시 보여 주는 도구입니다.
        </blockquote>
        <h2>글은 이렇게 만듭니다</h2>
        <ol>
          <li>현장에서 겪은 문제나 질문을 먼저 적습니다.</li>
          <li>
            AI 도구로 초안과 자료 조사를 보조하되, 사실과 숫자는 출처를 확인한
            뒤에만 씁니다. 확인하지 못한 내용은 "확인하지 못함"으로 표시합니다.
          </li>
          <li>게시 전에 사람이 검토하고, 근거가 부족한 문단은 다시 씁니다.</li>
          <li>
            게시 뒤에도 오류 제보를 받고, 수정된 글에는 수정일을 남깁니다.
          </li>
        </ol>
        <h2>정정과 업데이트</h2>
        <p>
          사실 오류나 오래된 정보를 알려 주시면 검토 후 수정하고, 글에 수정일을
          표시합니다. 제보는 <a href="/contact">문의 페이지</a>에서 받습니다.
          최신 법령·요율이 바뀌는 글(최저임금, 실업급여 등)은 정기적으로 다시
          확인합니다.
        </p>
        <h2>광고와 편집의 분리</h2>
        <p>
          이 블로그의 글은 광고비나 제휴 관계의 영향을 받지 않습니다. 광고는
          화면에 표시된 광고 영역에만 게재되며, 글의 내용과 분리되어 있습니다.
          광고가 붙었다고 해서 해당 상품을 추천하는 것은 아닙니다.
        </p>
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
