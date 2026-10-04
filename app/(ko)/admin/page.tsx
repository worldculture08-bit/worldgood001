import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";
import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata: Metadata = {
  title: "관리",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium text-accent">Admin</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">
        관리 모드
      </h1>
      {!admin ? (
        <>
          <p className="mt-3 text-sm text-ink-700">
            관리자 계정으로 로그인한 뒤 추천 코드를 만들고 관리할 수 있습니다.
          </p>
          <div className="mt-8 max-w-md">
            <AdminLoginForm />
          </div>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm text-ink-700">
            안녕하세요, <strong>{admin.username}</strong>님. 추천 코드를
            생성·목록·비활성할 수 있습니다.
          </p>
          <div className="mt-8">
            <AdminPanel />
          </div>
        </>
      )}
    </div>
  );
}
