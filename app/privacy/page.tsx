import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "하루기록의 개인정보 처리와 쿠키 사용에 관한 안내입니다.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium text-accent">Privacy</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">
        개인정보처리방침
      </h1>
      <div className="prose-ko mt-8">
        <p>시행일: 2026년 9월 17일</p>

        <h2>1. 수집하는 정보</h2>
        <p>
          회원 가입을 선택한 경우 아이디, 암호화된 비밀번호, 가입에 사용한 추천
          코드와 가입 시각을 저장합니다. 비밀번호 원문은 저장하지 않습니다.
        </p>

        <h2>2. 이용 목적</h2>
        <p>
          저장한 정보는 회원 식별, 로그인 유지, 추천 코드 사용량 관리와 서비스
          운영에만 사용합니다. 회원 정보를 판매하거나 광고주에게 제공하지
          않습니다.
        </p>

        <h2>3. 쿠키</h2>
        <p>
          로그인 상태를 유지하기 위해 httpOnly 세션 쿠키를 사용합니다. 로그인
          쿠키는 최대 7일 동안 유지되며 로그아웃하거나 만료되면 삭제됩니다.
          광고를 설정한 경우 Google AdSense가 자체 쿠키 또는 유사 기술을 사용할
          수 있으며, 그 처리에는 Google의 정책이 적용됩니다.
        </p>

        <h2>4. 보관과 삭제</h2>
        <p>
          회원 정보는 서비스를 운영하는 동안 보관합니다. 정보 삭제나 정정이
          필요하면 <a href="/contact">문의 페이지</a>를 통해 요청해 주세요.
          요청 내용을 확인한 뒤 가능한 범위에서 처리합니다.
        </p>

        <h2>5. 문의</h2>
        <p>
          개인정보에 관한 문의는 <a href="/contact">문의 안내</a>에 적힌
          저장소 이슈 창구를 이용해 주세요.
        </p>
      </div>
    </article>
  );
}
