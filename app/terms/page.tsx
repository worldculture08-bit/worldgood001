import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "하루기록 이용에 관한 기본 안내입니다.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium text-accent">Terms</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">
        이용약관
      </h1>
      <div className="prose-ko mt-8">
        <p>시행일: 2026년 9월 17일</p>

        <h2>1. 서비스의 성격</h2>
        <p>
          하루기록은 하루의 경험, 사람과 일에 관한 생각, 실무 도구 사용기를
          기록하고 공유하는 개인 블로그입니다. 글은 작성자의 경험과 관점을
          담으며, 특정 상황의 법률·노무·재무 자문을 대신하지 않습니다.
        </p>

        <h2>2. 회원 이용</h2>
        <p>
          회원은 본인의 아이디와 비밀번호를 안전하게 관리해야 합니다. 타인의
          정보를 도용하거나 사이트 운영을 방해하는 행위, 추천 코드를 부정하게
          사용하는 행위는 제한될 수 있습니다.
        </p>

        <h2>3. 콘텐츠와 광고</h2>
        <p>
          블로그 글의 저작권은 별도 표시가 없는 한 작성자에게 있습니다. 글을
          인용하거나 활용할 때는 출처를 밝혀 주세요. 사이트는 운영 과정에서
          광고를 게재할 수 있으며, 광고 내용과 상품·서비스의 거래는 광고주와
          이용자 사이의 책임으로 진행됩니다.
        </p>

        <h2>4. 변경과 중단</h2>
        <p>
          운영자는 글, 기능과 약관을 서비스 목적에 맞게 수정할 수 있습니다.
          중요한 변경은 사이트에 알리고, 기술적 사정이나 불가피한 사유가 있는
          경우 서비스 일부를 잠시 중단할 수 있습니다.
        </p>

        <h2>5. 문의</h2>
        <p>
          서비스 이용에 관한 문의는 <a href="/contact">문의 페이지</a>에서
          확인해 주세요.
        </p>
      </div>
    </article>
  );
}
