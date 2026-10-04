# publish.py -- one-command pipeline for new blog posts.
#
#   python3 scripts/publish.py              # classify new posts -> related -> build -> deploy
#   python3 scripts/publish.py --no-deploy  # build only (local check)
#
# Incremental: scripts/classify_categories.py and scripts/build_related.py skip
# posts that already have results, so a run only processes NEW posts.
# New post workflow: drop the .md into content/posts/ -> run this script -> done.

import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(title, args):
    print("\n=== %s ===" % title)
    if os.name == "nt" and args[0] in ("npm", "npx"):
        args = ["cmd", "/c"] + args  # npm/npx are .cmd shims on Windows
    r = subprocess.run(args, cwd=ROOT)
    if r.returncode != 0:
        print("\n[중단] %s 단계에서 실패 (exit %d)" % (title, r.returncode))
        sys.exit(r.returncode)
    return True


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    no_deploy = "--no-deploy" in sys.argv
    py = sys.executable or "python3"

    run("1/4 TypeSafe 카테고리 분류 (신규 글만)", [py, "scripts/classify_categories.py"])
    run("2/4 TypeSafe 관련 글 계산 (신규 글만)", [py, "scripts/build_related.py"])
    run("3/4 빌드", ["npm", "run", "build"])
    if no_deploy:
        print("\n=== 4/4 배포: 건너뜀 (--no-deploy) ===")
    else:
        run("4/4 Vercel 배포", ["npx", "vercel", "--prod", "--yes"])

    print("\n완료: 분류 → 관련 글 → 빌드 → %s" % ("배포" if not no_deploy else "배포 생략"))


if __name__ == "__main__":
    main()
