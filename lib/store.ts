import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type UserRole = "member" | "admin";

export type User = {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  referralCode: string | null;
  createdAt: string;
  active: boolean;
};

export type ReferralCode = {
  code: string;
  maxUses: number;
  usedCount: number;
  createdAt: string;
  active: boolean;
};

export type StoreData = {
  users: User[];
  referralCodes: ReferralCode[];
};

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "store.json");

const SUPABASE_URL = (() => {
  const raw = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "") || "";
  if (!raw) return "";
  // https://xxxx.supabase.co 와 https://xxxx.supabase.co/rest/v1 둘 다 허용
  return /\/rest\/v1$/.test(raw) ? raw : `${raw}/rest/v1`;
})();
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

const STORE_TABLE = "hj_store";
const STORE_ROW_ID = 1;

function useSupabase(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_SERVICE_ROLE_KEY.length > 0;
}

function emptyStore(): StoreData {
  return { users: [], referralCodes: [] };
}

async function supabaseRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    return { ok: false, status: res.status, data: null };
  }
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : null;
  return { ok: true, status: res.status, data };
}

type SupabaseReadResult = { ok: boolean; store: StoreData | null };

async function supabaseReadStore(): Promise<SupabaseReadResult> {
  const query = `/${STORE_TABLE}?select=data&id=eq.${STORE_ROW_ID}`;
  const { ok, data } = await supabaseRequest<{ data: StoreData | null }[]>(query);
  if (!ok) return { ok: false, store: null };
  const parsed = data?.[0]?.data as StoreData | undefined;
  if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.referralCodes)) {
    return { ok: true, store: parsed };
  }
  return { ok: true, store: null };
}

function isEmptyStore(store: StoreData): boolean {
  return store.users.length === 0 && store.referralCodes.length === 0;
}

async function supabaseWriteStore(store: StoreData): Promise<boolean> {
  const { ok } = await supabaseRequest(`/${STORE_TABLE}`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      id: STORE_ROW_ID,
      data: store,
      updated_at: new Date().toISOString(),
    }),
  });
  return ok;
}

function seedStore(): StoreData {
  const allowDevFallback = process.env.NODE_ENV !== "production";
  const adminUser =
    process.env.ADMIN_USERNAME?.trim() || (allowDevFallback ? "admin" : "");
  const adminPass =
    process.env.ADMIN_PASSWORD?.trim() ||
    (allowDevFallback ? "ChangeMeAdmin123!" : "");

  const passwordHash = bcrypt.hashSync(adminPass, 10);
  const now = new Date().toISOString();

  const codes: ReferralCode[] = [
    { code: "HJ-START-01", maxUses: 50, usedCount: 0, createdAt: now, active: true },
    { code: "HJ-FIELD-02", maxUses: 30, usedCount: 0, createdAt: now, active: true },
    { code: "HJ-WRITE-03", maxUses: 30, usedCount: 0, createdAt: now, active: true },
    { code: "HJ-LABOR-04", maxUses: 20, usedCount: 0, createdAt: now, active: true },
    { code: "HJ-GUEST-05", maxUses: 10, usedCount: 0, createdAt: now, active: true },
  ];

  const users: User[] = adminUser && adminPass
    ? [
        {
          id: "admin-1",
          username: adminUser,
          passwordHash,
          role: "admin",
          referralCode: null,
          createdAt: now,
          active: true,
        },
      ]
    : [];

  return { users, referralCodes: codes };
}

function fileReadStore(): StoreData {
  try {
    const raw = fs.readFileSync(storePath, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    if (Array.isArray(parsed.users) && Array.isArray(parsed.referralCodes)) {
      return parsed;
    }
  } catch {
    // 파일 없음/손상 — 시드 반환
  }
  return seedStore();
}

function fileWriteStore(data: StoreData): boolean {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch {
    // ponytail: 파일 저장소의 한계 — 실패를 호출자에게 알려 성공 위장을 막는다.
    return false;
  }
}

export async function readStore(): Promise<StoreData> {
  if (useSupabase()) {
    const remote = await supabaseReadStore();
    if (remote.ok) {
      if (remote.store && !isEmptyStore(remote.store)) return remote.store;
      const seeded = seedStore();
      // ponytail: 스키마가 만든 빈 행이면 시드(관리자·초기 추천코드)를 upsert해 초기화한다.
      if (await supabaseWriteStore(seeded)) return seeded;
      return remote.store ?? seeded;
    }
    // 읽기 실패 시 원격 데이터를 덮어쓰지 않도록 쓰기 없이 시드만 반환한다.
    return seedStore();
  }
  return fileReadStore();
}

export async function writeStore(data: StoreData): Promise<boolean> {
  if (useSupabase()) {
    return supabaseWriteStore(data);
  }
  return fileWriteStore(data);
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  const store = await readStore();
  return store.users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.active,
  );
}

export async function findReferral(code: string): Promise<ReferralCode | undefined> {
  const store = await readStore();
  return store.referralCodes.find(
    (c) => c.code.toUpperCase() === code.toUpperCase(),
  );
}
