-- 하루기록 회원·추천코드 저장소 (단일 행 JSON 방식)
-- Supabase SQL Editor에서 실행하세요.

create table if not exists public.hj_store (
  id integer primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- 단일 행(id=1) 보장용: 앱이 upsert(resolution=merge-duplicates)로 씁니다.
insert into public.hj_store (id, data)
values (1, '{"users":[],"referralCodes":[]}'::jsonb)
on conflict (id) do nothing;

-- service_role 키는 RLS를 우회하므로, 테이블은 RLS 활성화 + 정책 없음이 안전합니다.
alter table public.hj_store enable row level security;

-- (선택) 갱신 시각 자동 갱신 트리거
create or replace function public.hj_store_touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists hj_store_updated_at on public.hj_store;
create trigger hj_store_updated_at
  before update on public.hj_store
  for each row execute function public.hj_store_touch_updated_at();

-- ── 뉴스레터 구독자 ────────────────────────────────────────
-- 애드센스 외 수익(재방문)의 토대. 하루기록은 search-console.traffic 에
-- hjb_subscribe 를 추가해 신규/재방문을 나누어 봅니다.
create table if not exists public.hj_subscribers (
  email text primary key,
  created_at timestamptz not null default now(),
  source text not null default 'unknown'
);

-- 중복 구독은 ignore-duplicates(prefer 204)로 조용히 넘어간다.
alter table public.hj_subscribers enable row level security;

drop trigger if exists hj_subscribers_updated_at on public.hj_subscribers;
create trigger hj_subscribers_updated_at
  before update on public.hj_subscribers
  for each row execute function public.hj_store_touch_updated_at();
