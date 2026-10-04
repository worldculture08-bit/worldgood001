#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
본문 텍스트에 섞여 들어간 중국어/이탈 문자를 찾아낸다.

배경: 글을 빠르게 작성할 때 한자(중국어) 글자가 한국어 문장에 섞여 들어가는 일이
     반복됐다. 그대로 게시되면 즉시 "내용 신뢰도" 하락이고 애드센스 심사에 걸린다.
     게시 전에 이 스크립트를 돌려 깨끗함을 확인한다.

허용: 한글(완성형·자모) / ASCII / 라틴 보충 / 한자(일본어 라벨·중국어 번역본 전용은 제외)
사용: python scripts/check_text.py [--fix]
"""
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGETS = [
    *sorted((ROOT / "content" / "posts").rglob("*.md")),
    *sorted((ROOT / "app").rglob("*.tsx")),
    *sorted((ROOT / "app").rglob("*.ts")),
    *sorted((ROOT / "components").rglob("*.tsx")),
    *sorted((ROOT / "lib").rglob("*.ts")),
]

# 라벨 사전(5개 언어)은 한자를 정당하게 쓴다. 해당 파일은 검사에서 제외한다.
ALLOW_HAN_FILES = {
    ROOT / "lib" / "categories.ts",
    ROOT / "lib" / "i18n.ts",
}

PAREN_HAN = re.compile(r"\(([\u3400-\u9fff]+)\)")
HANGUL = re.compile(
    r"[\uac00-\ud7a3\u1100-\u11ff\u3130-\u318f\uac00-\ud7ff]"
)
# 라틴(Euro sign 등), 숫자, 문장부호, 공백
OK = re.compile(r"[A-Za-z0-9\u00a0-\u024f\u2010-\u203a\u20a0-\u20bf\u2190-\u21ff\u2212\u2248\u2500-\u27bf\u3000-\u303f\uff00-\uffef\n\r\t .,:;!?\"'()\[\]{}<>/\\@#%&*+=_`|~^$-]")

problems: list[str] = []

# 참고: 라틴 토큰 검사는 시도했다가 뺐다.
# 한국어는 조사를 라틴어에 공백 없이 붙여 쓴다(AI는, ChatGPT을). 이 규칙은
# 정상 문법을 전부 잡아 오탐이 수백 건이 되었고, 오탐이 많은 검사는 아무리
# 엄격해도 사람이 무시하게 만든다. CJK/기호 검사만 남긴다.
#
# 라틴 잔여 토큰(uiled, grove 같은)은 검출이 어렵기 때문에
# 새 글 작성 후 반드시 사람이 한 번 읽는 절차로 잡는다.


def scan(text: str, rel: str) -> None:
    for lineno, line in enumerate(text.splitlines(), 1):
        # 분(分) 처럼 반각 괄호로 병기한 한자 표기는 정상 한국어다 → 검사 제외
        in_parens = {m.start(1) + i for m in PAREN_HAN.finditer(line) for i in range(len(m.group(1)))}
        for col, ch in enumerate(line, 1):
            if ch in "\n\r\t" or OK.match(ch) or HANGUL.match(ch):
                continue
            # 한자/일본어/중국어
            if "\u3400" <= ch <= "\u9fff" or "\uf900" <= ch <= "\ufaff":
                if (col - 1) in in_parens:
                    continue  # 분(分) 형식의 정상 병기
                problems.append(f"{rel}:{lineno}:{col} 한자[{ch}] {line.strip()[:70]}")
                continue
            name = unicodedata.name(ch, "?")
            problems.append(f"{rel}:{lineno}:{col} 이탈[{ch} {name}] {line.strip()[:70]}")


def main() -> int:
    for p in TARGETS:
        if not p.exists() or p in ALLOW_HAN_FILES:
            continue
        scan(p.read_text(encoding="utf-8"), str(p.relative_to(ROOT)))

    if not problems:
        print("이상 없음 — 본문 텍스트가 깨끗합니다.")
        return 0

    for line in problems:
        print(line)
    print(f"\n문제 {len(problems)}건")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())