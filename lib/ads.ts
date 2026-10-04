// 광고 자리 정리 — 슬롯 이름 ↔ 환경변수 매핑과 본문 분할 로직.
//
// 수익 관점:
//   1) 본문 광고는 "글 맨 아래"가 아니라 "본문 중간"에 있어야 평당 수익이 붙는다.
//      아래 adSlotId() 는 단위별로 env를 따로 읽고, 안 채워진 자리는 조용히 숨긴다
//      (플레이스홀더 박스를 남겨두면 CLS가 생기고 거부 사유가 된다).
//   2) 슬롯을 늘리되, 승인 전(= env 없음)에는 아무 것도 렌더하지 않는다.

export type AdSlotName =
  | "banner"
  | "sidebar"
  | "in-article"
  | "in-article-2"
  | "footer";

export const AD_SLOT_NAMES: AdSlotName[] = [
  "banner",
  "sidebar",
  "in-article",
  "in-article-2",
  "footer",
];

export function adClient(): string {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "";
}

/**
 * 슬롯별 단위 ID.
 *
 * 반드시 `process.env.NEXT_PUBLIC_XXX` 리터럴로 읽어야 한다.
 * Next.js는 NEXT_PUBLIC_ 변수를 빌드 시점에 정적 리터럴 접근만 인라인하기
 * 때문에, `process.env[key]` 처럼 동적으로 읽으면 값이 비어 광고가 조용히
 * 사라진다. 그래서 슬롯별 함수를 하나씩 두고 리터럴로 읽는다.
 */
export function adSlotId(slot: AdSlotName): string {
  switch (slot) {
    case "banner":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER?.trim() ?? "";
    case "sidebar":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR?.trim() ?? "";
    case "in-article":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE?.trim() ?? "";
    case "in-article-2":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE_2?.trim() ?? "";
    case "footer":
      return process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER?.trim() ?? "";
  }
}

export function hasAd(slot: AdSlotName): boolean {
  return adSlotId(slot).length > 0;
}

/**
 * 렌더 중 화면에서 사라져도 되는 자리 — 없으면 아예 그리지 않는다.
 * 위(배너·본문)는 레이아웃 유지를 위해 자리를 잡아두지만, 푸터·사이드바는
 * 미설정 시 완전히 숨긴다.
 */
const ZERO_WHEN_MISSING: ReadonlySet<AdSlotName> = new Set(["footer", "sidebar"]);

const MIN_HEIGHT: Record<AdSlotName, string> = {
  banner: "min-h-[90px]",
  sidebar: "min-h-[250px]",
  "in-article": "min-h-[120px]",
  "in-article-2": "min-h-[120px]",
  footer: "min-h-[90px]",
};

export function adMinHeight(slot: AdSlotName): string {
  return MIN_HEIGHT[slot];
}

export function adCollapsesWhenMissing(slot: AdSlotName): boolean {
  return ZERO_WHEN_MISSING.has(slot);
}

const FORMAT: Record<AdSlotName, string> = {
  banner: "auto",
  sidebar: "vertical",
  "in-article": "auto",
  "in-article-2": "auto",
  footer: "auto",
};

export function adFormat(slot: AdSlotName): string {
  return FORMAT[slot];
}

// ── 본문 분할 ────────────────────────────────────────────────
//
// 긴 글에서 광고는 "읽기 흐름이 끊기는 지점"에 놓아야 한다.
// heading 태그가 글자 수 35%~60% 구간에 있으면 그 앞에서 자르고,
// 없으면 절반에서 자른다. 돌려받은 앞/뒤 HTML을 각각 .prose-ko 로 감싼다.

const SPLIT_HEADING_RE = /<(h2|h3)(\s[^>]*)?>/gi;

/** 본문을 [앞, 뒤]로 나눈다. 분할할 지점이 없으면 ["", html] 를 돌려준다. */
export function splitArticleHtml(html: string): [string, string] {
  const len = html.length;
  if (len < 1200) return ["", html];

  const min = Math.floor(len * 0.35);
  const max = Math.floor(len * 0.6);

  // 모듈 전역 정규식이라 lastIndex가 남아 있으면 다음 호출이 엉뚱한 지점을 찾는다.
  SPLIT_HEADING_RE.lastIndex = 0;
  for (let m = SPLIT_HEADING_RE.exec(html); m; m = SPLIT_HEADING_RE.exec(html)) {
    const at = m.index;
    if (at > max) break;
    if (at >= min) return [html.slice(0, at), html.slice(at)];
  }
  return ["", html];
}