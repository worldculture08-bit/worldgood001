import { NextResponse } from "next/server";
import { findUserByUsername } from "@/lib/store";
import { setSessionCookie, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

type Body = { username?: string; password?: string };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const username = (body.username || "").trim();
  const password = body.password || "";

  const user = await findUserByUsername(username);
  if (!user || user.role === "admin") {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  if (!(await setSessionCookie(user))) {
    return NextResponse.json(
      { error: "서버 로그인 설정이 완료되지 않았습니다." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    user: { username: user.username, role: user.role },
  });
}
