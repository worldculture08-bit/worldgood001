import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "로그인",
  description: "하루기록 회원 로그인",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium text-accent">Login</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">
        로그인
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        회원 아이디와 비밀번호로 로그인합니다. 관리자는{" "}
        <a href="/admin" className="text-accent hover:underline">
          /admin
        </a>
        을 이용해 주세요.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
