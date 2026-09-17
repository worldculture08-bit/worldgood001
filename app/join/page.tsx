import type { Metadata } from "next";
import JoinForm from "@/components/JoinForm";
import { readStore } from "@/lib/store";

export const metadata: Metadata = {
  title: "가입",
  description: "추천 코드로 하루기록 회원에 가입합니다.",
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function JoinPage() {
  const codes = (await readStore()).referralCodes.filter(
    (code) => code.active && code.usedCount < code.maxUses,
  );

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium text-accent">Join</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">
        회원 가입
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        가입에는 <strong>추천 코드</strong>가 필요합니다. 아이디·비밀번호를
        정한 뒤 코드를 입력해 주세요.
      </p>
      <div className="mt-8 space-y-5">
        <JoinForm />
        <section className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-lg font-semibold text-ink-900">
            사용 가능한 추천 코드
          </h2>
          <p className="mt-1 text-xs text-ink-700/70">
            코드 하나를 골라 가입 양식에 입력해 주세요.
          </p>
          <ul className="mt-4 space-y-2">
            {codes.map((code) => (
              <li
                key={code.code}
                className="flex items-center justify-between rounded-md bg-ink-50 px-3 py-2 text-sm"
              >
                <code className="font-semibold text-accent">{code.code}</code>
                <span className="text-xs text-ink-700/70">
                  남은 {code.maxUses - code.usedCount}회
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
