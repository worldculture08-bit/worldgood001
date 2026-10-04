# classify_categories.py -- categorize all posts via TypeSafe (Jev) Choice primitive.
# Reads the API key from TYPESAFE_API_KEY env or C:/Users/p/.aside-tasks/typesafe-key.txt
# (the key is NEVER stored in this repo).
#
# Usage:
#   python3 scripts/classify_categories.py            # classify -> scripts/classify-results.json
#
# Design follows the TypeSafe skill:
#   - state: structured JSON (title, description, tags, body excerpt)
#   - two independent Choice questions in ONE request per post (category + secondary)
#   - confidence returned per answer; low-confidence cases flagged for human review

import glob
import io
import json
import os
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

API_URL = "https://api.typesafe.ai/v1/systemone"
POSTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content", "posts")
OUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "classify-results.json")

CATEGORIES = {
    "ai-tools": "AI·디지털 도구 활용 — AI 도구 비교·선택·자동화·프롬프트·보안, SaaS 비용 점검 (예: ChatGPT 비교, 프롬프트 기록, AI 검증)",
    "work-life": "일하는 법·협업·소통 — 회의·후속 연락·신뢰·현장 소통·업무 노트·일정 관리처럼 일을 운영하는 방법",
    "labor-law": "노동법·급여·권리 계산 — 최저임금, 실업급여, 퇴직금, 주휴수당, 연차수당, 산재, 육아휴직 등 법·금액 계산과 권리 안내",
    "labor-world": "노동·산업 이야기 — 노동 현장의 풍경, 일자리의 변화, 산업 동향, 노동 존중처럼 논술·에세이 성격의 노동 주제",
    "habit-record": "습관·기록·회고 — 기록 습관, 아침·주간 루틴, 회고, 메모, 증거 기록처럼 개인의 반복 실천법",
    "money-life": "돈·생활 경제 — 재테크, 부동산, 복지, 구독료 절감처럼 개인 경제와 생활비 판단",
    "writing-blog": "글쓰기·블로그 — 글쓰기 기술, 블로그 운영, 독자 대상 문장, 글의 목적",
    "mindset": "마음가짐·자기관리 — 꾸준함, 느린 진전, 충분함에서 멈추기, 마음 다스리기처럼 태도·심리 주제",
    "planning": "기획·프로젝트 — 사람 연결, 프로젝트 시작·분할, 자료 읽기, 문제 해결 질문처럼 기획 실무",
    "other": "위 어느 것에도 맞지 않음",
}


def load_key():
    key = os.environ.get("TYPESAFE_API_KEY", "").strip()
    if key:
        return key
    p = os.path.join(os.path.expanduser("~"), ".aside-tasks", "typesafe-key.txt")
    # Windows home fallback
    if not os.path.exists(p):
        p = "C:/Users/p/.aside-tasks/typesafe-key.txt"
    with io.open(p, encoding="utf-8") as f:
        return f.read().strip()


def parse_post(path):
    with io.open(path, encoding="utf-8") as f:
        txt = f.read()
    fm, body = "", txt
    if txt.startswith("---"):
        parts = txt.split("---", 2)
        fm, body = parts[1], (parts[2] if len(parts) > 2 else "")
    meta = {}
    for line in fm.splitlines():
        if ":" in line and not line.startswith((" ", "\t")):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip('"')
    slug = os.path.splitext(os.path.basename(path))[0]
    return {
        "slug": slug,
        "title": meta.get("title", slug),
        "description": meta.get("description", ""),
        "tags": meta.get("tags", ""),
        "excerpt": " ".join(body.split())[:1200],
    }


def has_categories(path):
    with io.open(path, encoding="utf-8") as f:
        txt = f.read()
    if not txt.startswith("---"):
        return False
    fm = txt.split("---", 2)[1]
    return any(l.startswith("categories:") for l in fm.splitlines())


def apply_categories(slug, cats):
    """Write categories into the post frontmatter (replace if present)."""
    path = os.path.join(POSTS_DIR, slug + ".md")
    with io.open(path, encoding="utf-8") as f:
        txt = f.read()
    parts = txt.split("---", 2)
    fm = parts[1]
    body = parts[2] if len(parts) > 2 else ""
    val = "[" + ", ".join('"%s"' % c for c in cats) + "]"
    lines = fm.splitlines()
    if any(l.startswith("categories:") for l in lines):
        fm = "\n".join(
            ("categories: " + val) if l.startswith("categories:") else l for l in lines
        ) + "\n"
    else:
        fm = fm.rstrip("\n") + "\ncategories: " + val + "\n"
    with io.open(path, "w", encoding="utf-8") as f:
        f.write("---" + fm + "---" + body)


def ask(key, post):
    body = {
        "model": "jev-latest",
        "state": {
            "title": post["title"],
            "description": post["description"],
            "tags": post["tags"],
            "body_excerpt": post["excerpt"],
        },
        "questions": {
            "category": {
                "type": "choice",
                "instructions": {
                    "data": "글 정보는 `title`(제목), `description`(요약), `tags`(태그), `body_excerpt`(본문 발췌)이다.",
                    "question": "이 글의 주된 주제를 나타내는 카테고리를 하나 고른다. 글의 중심 주장이나 독자에게 주는 핵심 도움을 기준으로 판단한다.",
                },
                "criteria": dict(CATEGORIES),
            },
            "category_secondary": {
                "type": "choice",
                "instructions": {
                    "data": "글 정보는 `title`, `description`, `tags`, `body_excerpt`이다.",
                    "question": "이 글이 주제로 삼는 두 번째 주제가 있다면 그 카테고리를 고르고, 주제가 하나뿐이면 none을 고른다.",
                },
                "criteria": dict(CATEGORIES, **{"none": "부차 주제 없음, 주제가 하나뿐임"}),
            },
        },
    }
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode("utf-8"),
        headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
    )
    last_err = None
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            code = e.code
            last_err = "HTTP %s: %s" % (code, e.read().decode("utf-8", "replace")[:200])
            if code in (429, 529):
                time.sleep(2 ** attempt * 2)
                continue
            raise
        except Exception as ex:  # network hiccup
            last_err = str(ex)
            time.sleep(2 ** attempt)
    raise RuntimeError(last_err)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    force = "--force" in sys.argv
    key = load_key()
    files = sorted(glob.glob(os.path.join(POSTS_DIR, "*.md")))
    if not force:
        files = [p for p in files if not has_categories(p)]
    print("분류 대상:", len(files), "편", "(--force: 전체 재분류)" if force else "(이미 분류된 글 건너뜀)")
    if not files:
        print("새 글 없음 — 분류할 것 없음")
        return
    posts = [parse_post(p) for p in files]

    results = {}
    errors = {}

    def work(p):
        try:
            return p["slug"], ask(key, p)
        except Exception as ex:
            return p["slug"], ex

    with ThreadPoolExecutor(max_workers=4) as ex:
        for slug, res in ex.map(work, posts):
            if isinstance(res, Exception):
                errors[slug] = str(res)
                print("  [오류]", slug, res)
            else:
                results[slug] = res
                a = res["answers"]["category"]
                s = res["answers"]["category_secondary"]
                cats = [a["choice"]]
                if s["choice"] != "none" and s["choice"] != a["choice"]:
                    cats.append(s["choice"])
                apply_categories(slug, cats)
                print("  [분류] %-38s %-12s conf=%.2f  sub=%s" % (
                    slug, a["choice"], a["confidence"], s["choice"]))

    with io.open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump({"results": results, "errors": errors}, f, ensure_ascii=False, indent=1)
    print("\n완료:", len(results), "건 성공 /", len(errors), "건 실패 →", OUT_PATH)

    # distribution summary
    from collections import Counter
    dist = Counter(results[s]["answers"]["category"]["choice"] for s in results)
    print("\n=== 카테고리 분포 ===")
    for c, n in dist.most_common():
        print("  %-12s %d편" % (c, n))
    low = [(s, results[s]["answers"]["category"]["confidence"])
           for s in results if results[s]["answers"]["category"]["confidence"] < 0.55]
    if low:
        print("\n=== 낮은 확신도 (사람 검토 권장) ===")
        for s, c in sorted(low, key=lambda x: x[1]):
            print("  %-38s conf=%.2f" % (s, c))


if __name__ == "__main__":
    main()
