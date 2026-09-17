import { NextResponse } from "next/server";
import {
  findUserByUsername,
  readStore,
  writeStore,
  type User,
} from "@/lib/store";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

type Body = {
  username?: string;
  password?: string;
  referralCode?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const username = (body.username || "").trim();
  const password = body.password || "";
  const referralCode = (body.referralCode || "").trim().toUpperCase();

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    return NextResponse.json(
      { error: "아이디는 영문·숫자·밑줄 3~24자로 입력해 주세요." },
      { status: 400 },
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "비밀번호는 8자 이상이어야 합니다." },
      { status: 400 },
    );
  }
  if (!referralCode) {
    return NextResponse.json(
      { error: "추천 코드가 필요합니다." },
      { status: 400 },
    );
  }

  if (await findUserByUsername(username)) {
    return NextResponse.json(
      { error: "이미 사용 중인 아이디입니다." },
      { status: 409 },
    );
  }

  const store = await readStore();
  const code = store.referralCodes.find(
    (c) => c.code.toUpperCase() === referralCode,
  );
  if (!code || !code.active) {
    return NextResponse.json(
      { error: "유효하지 않거나 비활성인 추천 코드입니다." },
      { status: 400 },
    );
  }
  if (code.usedCount >= code.maxUses) {
    return NextResponse.json(
      { error: "이 추천 코드는 사용 한도에 도달했습니다." },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username,
    passwordHash,
    role: "member",
    referralCode: code.code,
    createdAt: new Date().toISOString(),
    active: true,
  };

  code.usedCount += 1;
  store.users.push(user);
  if (!(await writeStore(store))) {
    return NextResponse.json(
      { error: "회원 저장소가 연결되지 않았습니다. 관리자에게 문의해 주세요." },
      { status: 503 },
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
