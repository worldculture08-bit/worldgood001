"use client";

import { FormEvent, useState } from "react";

type Props = {
  /** 이 폼이 어느 페이지에 붙어 있는지 (유입 분석용) */
  source: string;
  className?: string;
};

/**
 * 뉴스레터 구독 폼.
 * 애드센스 수익 외의 유일한 재방문 자산이라, 홈·카테고리·글 하단에 둔다.
 */
export default function NewsletterForm({ source, className = "" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { error?: string; duplicate?: boolean };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "구독에 실패했습니다.");
        return;
      }
      setStatus("done");
      setMessage(
        data.duplicate
          ? "이미 구독 중이십니다. 앞으로 새 글만 보내드릴게요."
          : "구독 완료했습니다. 새 글이 올라올 때 보내드릴게요.",
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-xl border border-ink-200 bg-white p-5 ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Newsletter
      </p>
      <h2 className="mt-1 font-serif text-lg font-semibold text-ink-900">
        새 글부터 알려 드리는 곳
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">
        전세·연금·세금 같은 돈과 관련된 계산을 주 1~2번 정리해 보냅니다.
        광고나 스팸은 없습니다. 언제든 아래 구독 취소 링크로 탈퇴할 수 있습니다.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`nl-${source}`}>
          이메일 주소
        </label>
        <input
          id={`nl-${source}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "done"}
          className="shrink-0 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
        >
          {status === "loading" ? "처리 중…" : status === "done" ? "완료" : "구독하기"}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={`mt-3 text-sm ${status === "error" ? "text-red-700" : "text-accent"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}