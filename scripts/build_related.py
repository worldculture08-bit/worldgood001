# build_related.py -- semantic related-posts precompute via TypeSafe (Jev).
#
# For each post: shortlist candidates with the tag/category heuristic, then send
# ONE TypeSafe request with one Noul question per candidate (parallel questions
# pattern: batching all questions in one call is cheaper and faster). Rank by
# P(related) and write content/related.json for the site to consume at build time.
#
# Cost model: 65 requests total (one per post), run only when posts change.
# The API key stays on this machine -- it is NEVER deployed to Vercel.
#
# Key: TYPESAFE_API_KEY env, or ~/.aside-tasks/typesafe-key.txt
# Usage:
#   python3 scripts/build_related.py            # -> content/related.json

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
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(ROOT, "content", "posts")
OUT_PATH = os.path.join(ROOT, "content", "related.json")

SHORTLIST = 8   # candidates judged per post
TOP_N = 3       # related links kept per post


def load_key():
    key = os.environ.get("TYPESAFE_API_KEY", "").strip()
    if key:
        return key
    p = os.path.join(os.path.expanduser("~"), ".aside-tasks", "typesafe-key.txt")
    if not os.path.exists(p):
        p = "C:/Users/p/.aside-tasks/typesafe-key.txt"
    with io.open(p, encoding="utf-8") as f:
        return f.read().strip()


def parse_list(raw):
    raw = raw.strip()
    if raw.startswith("["):
        try:
            return [str(x) for x in json.loads(raw)]
        except Exception:
            pass
    return [t.strip().strip('"\'') for t in raw.strip("[]").split(",") if t.strip()]


def parse_posts():
    posts = {}
    for path in sorted(glob.glob(os.path.join(POSTS_DIR, "*.md"))):
        with io.open(path, encoding="utf-8") as f:
            txt = f.read()
        fm = txt.split("---", 2)[1] if txt.startswith("---") else ""
        meta = {}
        for line in fm.splitlines():
            if ":" in line and not line.startswith((" ", "\t")):
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip().strip('"')
        slug = os.path.splitext(os.path.basename(path))[0]
        posts[slug] = {
            "slug": slug,
            "title": meta.get("title", slug),
            "description": meta.get("description", ""),
            "tags": parse_list(meta.get("tags", "")),
            "categories": parse_list(meta.get("categories", "")),
        }
    return posts


def heuristic_score(a, b):
    s = 0.0
    if a["categories"] and b["categories"] and a["categories"][0] == b["categories"][0]:
        s += 3
    s += 1.5 * len(set(a["categories"]) & set(b["categories"]))
    s += 1.0 * len(set(a["tags"]) & set(b["tags"]))
    return s


def shortlist(post, posts):
    scored = []
    for slug, other in posts.items():
        if slug == post["slug"]:
            continue
        scored.append((heuristic_score(post, other), other))
    scored.sort(key=lambda x: x[0], reverse=True)
    return scored[:SHORTLIST]


def ask_related(key, post, candidates):
    questions = {}
    ids = {}
    for i, (hs, other) in enumerate(candidates):
        qid = "c%d" % i
        ids[qid] = (hs, other)
        questions[qid] = {
            "type": "noul",
            "instructions": {
                "candidate": {
                    "title": other["title"],
                    "description": other["description"],
                    "tags": other["tags"],
                    "categories": other["categories"],
                },
                "question": (
                    "독자가 `title` 글을 방금 읽었다. 이 독자가 곧바로 `candidate` 글도 "
                    "읽을 만큼 두 글이 의미 있게 관련되어 있는가?"
                ),
            },
            "criteria": {
                "true": "같은 문제·주제·독자 상황을 다루거나 이어서 읽으면 실질적으로 도움이 됨",
                "false": "주제가 달라 이어서 읽어도 독자에게 얻는 것이 없음",
            },
        }
    body = {
        "model": "jev-latest",
        "state": {
            "title": post["title"],
            "description": post["description"],
            "tags": post["tags"],
            "categories": post["categories"],
        },
        "questions": questions,
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
                return json.loads(r.read()), ids
        except urllib.error.HTTPError as e:
            last_err = "HTTP %s: %s" % (e.code, e.read().decode("utf-8", "replace")[:200])
            if e.code in (429, 529):
                time.sleep(2 ** attempt * 2)
                continue
            raise
        except Exception as ex:
            last_err = str(ex)
            time.sleep(2 ** attempt)
    raise RuntimeError(last_err)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    force = "--force" in sys.argv
    key = load_key()
    posts = parse_posts()
    existing = {}
    if os.path.exists(OUT_PATH) and not force:
        with io.open(OUT_PATH, encoding="utf-8") as f:
            existing = json.load(f)
        posts = {s: p for s, p in posts.items() if s not in existing}
    print("대상 글:", len(posts), "편 (기존 %d편 건너뜀) / 글당 후보 %d개 → 관련 글 %d개 선정" % (
        len(existing), SHORTLIST, TOP_N))
    if not posts:
        print("새 글 없음 — 계산할 것 없음")
        return

    related = {}
    errors = {}
    usage_in = usage_out = 0
    examples = []

    def work(item):
        slug, post = item
        cands = shortlist(post, posts)
        if not cands:
            return slug, [], None
        try:
            res, ids = ask_related(key, post, cands)
            return slug, (res, ids), None
        except Exception as ex:
            return slug, None, str(ex)

    with ThreadPoolExecutor(max_workers=4) as pool:
        for slug, payload, err in pool.map(work, posts.items()):
            if err:
                errors[slug] = err
                print("  [오류]", slug, err)
                continue
            if payload == []:
                related[slug] = []
                continue
            res, ids = payload
            usage_in += res.get("usage", {}).get("input_tokens", 0)
            usage_out += res.get("usage", {}).get("output_tokens", 0)
            scored = []
            for qid, (hs, other) in ids.items():
                noul = res["answers"][qid]["noul"]
                scored.append((noul, hs, other["slug"]))
            scored.sort(key=lambda x: (x[0], x[1]), reverse=True)
            related[slug] = [s for _, _, s in scored[:TOP_N]]
            if len(examples) < 6:
                examples.append((slug, [(s, round(n, 2)) for n, _, s in scored[:TOP_N]]))

    merged = dict(existing)
    merged.update(related)
    with io.open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=0)
    print("\n완료: %d건 신규 기록(누적 %d건) / %d건 실패 → %s" % (
        len(related), len(merged), len(errors), OUT_PATH))
    print("토큰 사용량: input %d / output %d" % (usage_in, usage_out))
    print("\n=== 샘플 (관련 글: 관련성 확률) ===")
    for slug, items in examples:
        print(" ", slug)
        for s, n in items:
            print("     → %-38s %.2f" % (s, n))
    if errors:
        print("\n실패한 글:", list(errors.keys()))


if __name__ == "__main__":
    main()
