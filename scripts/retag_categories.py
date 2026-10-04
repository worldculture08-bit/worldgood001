#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
기존 글의 categories frontmatter를 수익 카테고리(전세/연금/세금/주거/투자)로 재배치한다.

배경: 글 74편 중 38편이 '습관·기록·글쓰기' 계열이라 검색 수요가 거의 없었다.
     재테크/노동 키워드로 검색 의도가 명확한 글을 수익 카테고리에 정확히 붙인다.

멱등: 이미 목표 categories면 건너뛴다. 대상은 아래 MAP에 선언되어 있다.
사용: python scripts/retag_categories.py [--dry]
"""
import re
import sys
from pathlib import Path

POSTS = Path(__file__).resolve().parent.parent / "content" / "posts"

# slug -> 새 categories (frontmatter categories 값을 통째로 교체)
MAP = {
    # ── 전세·보증금 ──
    "rent-limit-calculator": ["jeonse", "money-life"],
    # ── 주거·부동산 ──
    "apartment-wealth-myth": ["housing", "money-life"],
    # ── 저축·투자·금리 ──
    "one-year-money-comparison": ["money-invest"],
    "emergency-fund-3-months": ["money-invest", "habit-record"],
    "ai-subscription-audit": ["ai-tools", "money-invest"],
    "ai-plan-overlap-one-person": ["ai-tools", "money-invest"],
    "copilot-roi-calculation": ["ai-tools", "money-invest"],
    "hybrid-work-cost-calculator": ["work-life", "money-invest"],
    # ── 세금·연말정산 ──
    "year-end-tax-comparison": ["tax"],
    "net-pay-four-insurances-2026": ["labor-law", "tax"],
    "unused-annual-leave-pay": ["labor-law", "tax"],
    # ── 노동법·급여 (돈으로 이어지는 쟁점 첨가) ──
    "severance-pay-checklist": ["labor-law", "money-life"],
    "severance-pay-one-year": ["labor-law", "money-life"],
    "unemployment-benefit-2026": ["labor-law", "money-life"],
    "parental-leave-pay-2026": ["labor-law", "money-life"],
    "weekly-holiday-allowance": ["labor-law", "tax"],
    "minimum-wage-2026-monthly": ["labor-law", "tax"],
    "employment-type-comparison": ["labor-law"],
    "labor-contract-checklist": ["labor-law", "work-life"],
    "industrial-accident-claim-checklist": ["labor-law"],
    "industrial-accident-shutdown-pay": ["labor-law", "money-life"],
    "resignation-type-unemployment": ["labor-law"],
    "end-of-labor-basic-income": ["labor-world", "labor-law"],
}

CAT_RE = re.compile(r"^categories:.*$", re.MULTILINE)


def render(cats: list[str]) -> str:
    return "categories: [" + ", ".join(f'"{c}"' for c in cats) + "]"


def main() -> int:
    dry = "--dry" in sys.argv
    changed, skipped, missing = [], [], []

    for slug, cats in MAP.items():
        f = POSTS / f"{slug}.md"
        if not f.exists():
            missing.append(slug)
            continue
        text = f.read_text(encoding="utf-8")
        m = CAT_RE.search(text)
        if not m:
            print(f"[!] categories 없음: {slug}")
            missing.append(slug)
            continue
        new_line = render(cats)
        if m.group(0).strip() == new_line:
            skipped.append(slug)
            continue
        updated = CAT_RE.sub(new_line, text, count=1)
        changed.append(slug)
        if not dry:
            f.write_text(updated, encoding="utf-8")
            print(f"[수정] {slug}: {m.group(0).strip()} -> {new_line}")

    print(f"\n변경 {len(changed)} · 이미 일치 {len(skipped)} · 누락/오류 {len(missing)}")
    if missing:
        print("누락:", ", ".join(missing))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())