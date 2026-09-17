import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readStore, writeStore, type ReferralCode } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const store = await readStore();
  return NextResponse.json({ codes: store.referralCodes });
}

type CreateBody = { code?: string; maxUses?: number };

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  let body: CreateBody;
  try {
    body = (await req.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const code = (body.code || "").trim().toUpperCase();
  const maxUses = Number(body.maxUses ?? 10);

  if (!/^[A-Z0-9-]{4,32}$/.test(code)) {
    return NextResponse.json(
      { error: "코드는 영문 대문자·숫자·하이픈 4~32자로 입력해 주세요." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(maxUses) || maxUses < 1 || maxUses > 10000) {
    return NextResponse.json(
      { error: "사용 한도는 1~10000 사이여야 합니다." },
      { status: 400 },
    );
  }

  const store = await readStore();
  if (store.referralCodes.some((c) => c.code === code)) {
    return NextResponse.json(
      { error: "이미 존재하는 코드입니다." },
      { status: 409 },
    );
  }

  const entry: ReferralCode = {
    code,
    maxUses,
    usedCount: 0,
    createdAt: new Date().toISOString(),
    active: true,
  };
  store.referralCodes.unshift(entry);
  if (!(await writeStore(store))) {
    return NextResponse.json(
      { error: "추천 코드 저장소가 연결되지 않았습니다." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, code: entry });
}
