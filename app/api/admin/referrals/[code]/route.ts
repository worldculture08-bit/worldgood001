import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export const runtime = "nodejs";

type Props = { params: Promise<{ code: string }> };

export async function PATCH(req: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { code: raw } = await params;
  const codeKey = decodeURIComponent(raw).toUpperCase();

  let body: { active?: boolean };
  try {
    body = (await req.json()) as { active?: boolean };
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const store = await readStore();
  const entry = store.referralCodes.find((c) => c.code === codeKey);
  if (!entry) {
    return NextResponse.json(
      { error: "코드를 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  if (typeof body.active === "boolean") {
    entry.active = body.active;
  }
  if (!(await writeStore(store))) {
    return NextResponse.json(
      { error: "추천 코드 저장소가 연결되지 않았습니다." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, code: entry });
}
