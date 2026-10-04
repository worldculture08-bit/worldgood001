// 뉴스레터 구독자 저장소.
//
// 애드센스만으로는 수익에 천장이 있다. 검색으로 들어온 방문자는 다시 방문하지
// 않으므로, 이메일 한 통이 유일한 "재방문 자산"이다.
//
// 저장 위치:
//   1) Supabase hj_subscribers 테이블 (환경변수 설정 시, 운영 권장)
//   2) data/subscribers.json (로컬 개발 폴백 — Vercel 서버리스에선 보존 안 됨)
// SDK 의존성 없이 REST fetch 만 쓴다.

import fs from "fs";
import path from "path";

export type Subscriber = {
  email: string;
  createdAt: string;
  source: string;
};

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "subscribers.json");

const SUPABASE_URL = (() => {
  const raw = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "") || "";
  if (!raw) return "";
  return /\/rest\/v1$/.test(raw) ? raw : `${raw}/rest/v1`;
})();
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

const TABLE = "hj_subscribers";

export function usingSupabase(): boolean {
  return SUPABASE_URL.length > 0 && SERVICE_KEY.length > 0;
}

/** 이메일 정규화 — 대소문자·공백을 지워 중복 구독을 막는다. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  // RFC를 다 지키지 않는다. 실사용에서 걸러질 noise 를 줄이는 실용적 검사.
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) && email.length <= 254;
}

async function supabaseInsert(sub: Subscriber): Promise<{ ok: boolean; duplicate: boolean }> {
  try {
    const res = await fetch(`${SUPABASE_URL}/${TABLE}`, {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(sub),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, duplicate: false };
    // 201 = 삽입 성공, 204/200 = 중복이라 무시됨(ignore-duplicates).
    return { ok: true, duplicate: res.status === 200 || res.status === 204 };
  } catch {
    return { ok: false, duplicate: false };
  }
}

function fileRead(): Subscriber[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as Subscriber[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // 파일 없음/손상 — 빈 목록으로 시작
  }
  return [];
}

function fileWrite(list: Subscriber[]): boolean {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
    return true;
  } catch {
    // 서버리스 읽기 전용 FS 에서 실패할 수 있다. 호출자가 503 을 돌려준다.
    return false;
  }
}

/**
 * 구독 추가.
 * 반환: added(신규) | duplicate(이미 있음) | failed(저장 실패)
 * 이미 구독한 사람에게 다시 "신청했다"고 하지 않기 위해 duplicate 를 구분한다.
 */
export async function addSubscriber(
  email: string,
  source: string,
): Promise<{ status: "added" | "duplicate" | "failed" }> {
  const sub: Subscriber = {
    email: normalizeEmail(email),
    createdAt: new Date().toISOString(),
    source: (source || "unknown").slice(0, 40),
  };

  if (usingSupabase()) {
    const { ok, duplicate } = await supabaseInsert(sub);
    if (!ok) return { status: "failed" };
    return { status: duplicate ? "duplicate" : "added" };
  }

  const list = fileRead();
  if (list.some((s) => s.email === sub.email)) return { status: "duplicate" };
  list.push(sub);
  return fileWrite(list) ? { status: "added" } : { status: "failed" };
}

export async function countSubscribers(): Promise<number> {
  if (!usingSupabase()) return fileRead().length;
  try {
    const res = await fetch(`${SUPABASE_URL}/${TABLE}?select=email`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: "count=exact",
        Range: "0-0",
      },
      cache: "no-store",
    });
    const range = res.headers.get("content-range") || "";
    const total = Number(range.split("/")[1] || 0);
    return Number.isFinite(total) ? total : 0;
  } catch {
    return 0;
  }
}