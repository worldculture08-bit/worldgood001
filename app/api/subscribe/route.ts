import { NextResponse } from "next/server";
import { addSubscriber, isValidEmail, normalizeEmail } from "@/lib/subscribers";

export const runtime = "nodejs";

type Body = {
  email?: string;
  /** 어떤 페이지에서 신청했는지 — 이후 유입 분석에 쓴다 */
  source?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const email = normalizeEmail(body.email || "");
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "이메일 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const result = await addSubscriber(email, body.source || "unknown");

  if (result.status === "failed") {
    // 저장 실패를 성공으로 돌려주면 구독자가Newsletter 는 받게 되지만 아무도 못 보낸다.
    return NextResponse.json(
      { error: "구독 저장에 실패했습니다. 잠시 뒤 다시 시도해 주세요." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, duplicate: result.status === "duplicate" });
}