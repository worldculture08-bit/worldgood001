# 하루기록 (worldgood001)

현장·사람·기록 — Next.js 기반 **AdSense 준비형** 한국어 블로그입니다.

짧은 URL, 마크다운 글, 추천 코드 기반 회원 가입, 관리자 추천 코드 관리까지 포함한 개인 사이트 골격입니다.

## 포함 기능

- 홈: `content/posts/*.md` 글 목록
- 글 상세: `/p/[slug]` (구 `/posts/[slug]` 는 리다이렉트)
- 소개: `/about`
- 가입: `/join` (추천 코드 필수)
- 로그인: `/login`
- 관리: `/admin` (관리자만 추천 코드 생성·목록·비활성)
- AdSense용 광고 자리 (배너·사이드바·본문 중간) + 클라이언트·단위 ID 환경변수
- SEO: 메타데이터, Open Graph, `sitemap.ts`, `robots.ts`
- 본문 글 30편 (영문 kebab-case 슬러그)

## 짧은 주소 / 도메인

- 사이트 제목 메타: **하루기록**
- 글 URL은 `/p/why-write`처럼 짧은 영문 슬러그를 사용합니다. (한글 경로의 긴 인코딩을 피함)
- 나중에 커스텀 도메인(예: `hyeonjang.kr`)을 연결하면 GitHub/Vercel 기본 URL 대신 쓸 수 있습니다. `NEXT_PUBLIC_SITE_URL`만 바꾸면 사이트맵·OG에 반영됩니다.

## 기술 스택

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- gray-matter + remark / remark-html (마크다운)
- bcryptjs + httpOnly 세션 쿠키 (로컬 JSON 스토어)

## 시작하기

```bash
cp .env.example .env.local
# SESSION_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD 를 채우세요

npm install
npm run dev
```

프로덕션 빌드:

```bash
npm run build
npm start
```

정적 검사:

```bash
npm run lint
```

현재 `lint`는 별도 ESLint 의존성을 추가하지 않고 TypeScript 오류를 검사합니다.

첫 회원 가입이나 추천 코드 변경 시 `data/store.json`이 생성되며, 관리자 계정과 초기 추천 코드가 시드됩니다. (`data/store.json`은 gitignore)

개발 환경에서 환경 변수를 비워 두면 관리자 `admin` / `ChangeMeAdmin123!`이 임시로 사용됩니다. 이 계정은 로컬 확인 전용이며, 배포 전에는 반드시 `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`을 실제 값으로 설정하세요.

## 회원·추천 코드·관리자

1. `/join`에서 아이디·비밀번호·**추천 코드**로 가입
2. `/login`으로 회원 로그인
3. `/admin`에서 관리자 로그인 후 추천 코드 생성·목록·비활성
4. 헤더: 글홈 · 소개 · 가입 · 로그인 (관리자 세션일 때만 **관리** 링크)

비밀번호는 bcryptjs로 해시하고, 세션은 `SESSION_SECRET`으로 서명한 httpOnly 쿠키를 사용합니다. **실제 비밀번호·시크릿을 저장소에 커밋하지 마세요.** `.env.example`의 플레이스홀더만 참고하세요.

## 글 추가하는 방법

1. `content/posts/`에 `short-english-slug.md` 파일을 만듭니다.
2. frontmatter 예시:

```markdown
---
title: "제목"
date: "2026-09-16"
description: "한 줄 요약"
tags: ["태그1", "태그2"]
---

본문…
```

3. 저장 후 `/p/short-english-slug`로 열립니다.

## AdSense 설정

1. [Google AdSense](https://www.google.com/adsense/)에서 사이트를 등록·승인받습니다.
2. `.env.local`에 `NEXT_PUBLIC_ADSENSE_CLIENT`를 넣습니다.
3. AdSense에서 발급한 광고 단위 ID를 `NEXT_PUBLIC_ADSENSE_SLOT_BANNER`, `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`, `NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE`에 넣습니다.
4. `public/ads.txt`에 AdSense가 안내하는 한 줄을 넣어 배포합니다. (**가짜 publisher ID 금지**)

환경 변수가 비어 있으면 안내 플레이스홀더가 표시됩니다.

## Vercel 배포

1. 저장소를 Vercel에 Import
2. Environment Variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_CLIENT`, 세 광고 단위 ID, `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
3. 배포 후 커스텀 도메인 연결 (예: hyeonjang.kr)
4. 회원·추천인 저장소는 아래 **Supabase 연결** 섹션을 참고하세요. 환경변수가 없으면 로컬 파일 스토어(`data/store.json`)로 폴백하며, Vercel 서버리스의 읽기 전용 파일 시스템에서는 저장이 보장되지 않습니다.

## Supabase 연결 (회원·추천 코드 영속 저장)

회원·추천 코드 데이터를 Vercel 등 서버리스 환경에서도 영속 저장하려면 Supabase를 연결합니다. SDK 없이 REST fetch만 사용하므로 의존성 추가가 없습니다.

1. [Supabase](https://supabase.com/)에서 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다. (`hj_store` 테이블 생성 + RLS 활성화)
3. 프로젝트 설정 > API에서 **Project URL**과 **service_role** 키를 복사합니다.
4. Vercel(또는 `.env.local`)에 환경변수를 설정합니다:
   - `SUPABASE_URL` = Project URL (예: `https://xxxx.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role 키 (**서버 전용** — `NEXT_PUBLIC_` 접두사 금지, 브라우저에 노출되면 안 됩니다)
5. 환경변수를 설정한 후 **재배포**합니다.

두 환경변수가 모두 설정되면 회원·추천 코드가 `hj_store` 테이블(id=1 단일 행 JSON, upsert)에 저장됩니다. 설정되어 있지 않으면 기존대로 로컬 파일 스토어(`data/store.json`)로 동작하므로 로컬 개발에는 영향이 없습니다.

## 폴더 구조 (요약)

```
app/                 # 페이지·API·sitemap·robots
components/          # Header, 폼, AdSlot 등
content/posts/       # 마크다운 글
data/                # store.json (런타임 시드, gitignore)
lib/                 # posts, site, auth, store
public/ads.txt       # AdSense 템플릿
```

---

만든이: **씩씩한 하루** — 하루기록을 쓰는 낙관적인 기록자.
