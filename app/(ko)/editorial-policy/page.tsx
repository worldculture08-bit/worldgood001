import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "편집정책",
  description:
    "하루기록이 어떤 기준으로 글을 쓰고, 근거를 어떻게 확인하고, 광고와 제휴를 어떻게 표시하는지 정리한 편집정책입니다.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: `편집정책 · ${siteConfig.name}`,
    description: "누가, 무엇을, 왜, 어떻게 쓰는지 정리한 편집정책.",
    url: `${siteConfig.url}/editorial-policy`,
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium text-accent">Editorial Policy</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
        편집정책
      </h1>
      <p className="mt-3 text-base leading-relaxed text-ink-700">
        이 글은{" "}
        <strong>누가</strong>, <strong>무엇을</strong> 근거로{" "}
        <strong>왜</strong> 쓰는지, <strong>어떻게</strong> 검토하는지를 설명합니다.
        마지막 확인일은 2026년 10월 4일입니다.
      </p>

      <div className="prose-ko mt-8">
        <h2>누가 쓰는가</h2>
        <p>
          모든 글은 <Link href="/about">{siteConfig.author}</Link>가 직접 씁니다.
          대필이나 자동 생성 후 수정만 거친 글을 게시하지 않습니다. 글 하단
          바이라인에 작성자가 함께 표기됩니다.
        </p>

        <h2>어떤 주제를 쓰는가</h2>
        <p>
          실제로 한 일이거나 직접 계산해 본 것을 씁니다. 다루는 축은 셋입니다.
        </p>
        <ul>
          <li>
            <strong>돈과 관련된 계산</strong> — 전세·보증금, 연금저축, 세금, 저축과
            투자, 주거 비용
          </li>
          <li>
            <strong>일하는 사람에게 필요한 노동법</strong> — 임금 계산, 해고, 산재,
            실업급여 같은 실제 처분에서 달라지는 금액
          </li>
          <li>
            <strong>업무에 쓰는 도구와 기록법</strong> — 실제로 쓰고 비용을 비교한
            결과
          </li>
        </ul>
        <p>
          각 글 상단에는 기준일이 들어갑니다. 요율이나 법령이 바뀔 수 있는 글은
          다시 확인하고 수정일을 함께 남깁니다.
        </p>

        <h2>근거를 어떻게 확인하는가</h2>
        <ol>
          <li>
            금액과 요율은{" "}
            <strong>원문에서 직접 확인</strong>합니다. 공식 공고·기관 안내·법령
            원문을 먼저 보고, 언론 요약은 출발점으로만 씁니다.
          </li>
          <li>
            확인한 수치는 계산 과정을 그대로 씁니다. 대입한 값과 나온 값을 둘 다
            보여 줘야 다른 사람이 같은 답을 재현할 수 있습니다.
          </li>
          <li>
            확인하지 못한 것은{" "}
            <strong>확인하지 못했다고 적습니다</strong>. 추정과 사실을 같은
            문장에서 섞지 않습니다.
          </li>
          <li>
            글이나 영상에서 본 설명은 "출처를 말한 주장"으로 구분해 적고, 확인
            가능한 원문이 있으면 거기를 가리킵니다.
          </li>
        </ol>

        <h2>계산 예시는 언제나 예시다</h2>
        <p>
          글에 들어가는 계산은 이해를 돕기 위한 예시입니다. 실제 소속, 취업규칙,
          단체협약, 개인 사정에 따라 결과가 달라집니다. 권리 판단의
          근거가 되는 것은 언제나{" "}
          <strong>본인이 체결한 계약과 최신 법령·기관 안내</strong>입니다.
        </p>

        <h2>광고와 수익의 표시</h2>
        <p>
          이 사이트는 광고와 제휴 링크로 수익을 얻습니다. 그래서 규칙을 분명히
          해 둡니다.
        </p>
        <ul>
          <li>
            <strong>광고</strong>는 글 본문과 분리된 지정 영역에만 표시되며, 광고의
            존재가 글의 결론을 바꾸지 않습니다.
          </li>
          <li>
            <strong>제휴 링크</strong>로 수익을 받는 경우, 해당 글 안에 고지를
            함께 표시합니다. 고지 없는 제휴 링크는 게시하지 않습니다.
          </li>
          <li>
            <strong>직접 써보지 않은 제품</strong>은 추천하지 않습니다. 후원으로
            비용을 지원받은 도구라도 그렇게 표기합니다.
          </li>
          <li>
            특정 제품·회사·정부기관을 쓰거나 추천하지 않는 데 돈을 받지 않습니다.
          </li>
        </ul>

        <h2>정정 절차</h2>
        <p>
          잘못된 내용이나 낡은 정보를 발견하면{" "}
          <Link href="/contact">문의 페이지</Link>로 알려 주세요. 확인 후 수정하고
          수정일을 남깁니다. 수정이 필요한데 하지 않은 경우에도 그 사실을
          공개합니다.
        </p>

        <h2>이 정책을 언제 바꾸는가</h2>
        <p>
          수익 구조나 평가 방식이 달라지면 이 페이지를 먼저 고칩니다. 이 문서
          자체에 대한 문의도 <Link href="/contact">문의 페이지</Link>로 받습니다.
        </p>
      </div>
    </div>
  );
}