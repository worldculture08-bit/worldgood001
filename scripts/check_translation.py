# check_translation.py -- quality gate for translated posts.
#
#   python3 scripts/check_translation.py            # check all languages
#   python3 scripts/check_translation.py es         # check one language
#
# Catches language bleed: stray CJK characters in a Latin-script translation,
# leftover source-language text, and missing frontmatter.

import os
import re
import sys
import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Characters that must NOT appear inside a Latin-script (es) translation.
CJK = re.compile(r"[\u3000-\u9fff\uac00-\ud7a3]")

# Common English filler words that should not appear in a Spanish body.
# Matched case-insensitively as whole words.
EN_STOPWORDS = {
    "the", "and", "with", "that", "this", "from", "have", "been", "will",
    "your", "they", "about", "which", "would", "there", "their", "when",
    "what", "into", "more", "than", "also", "only", "other", "such",
}

WORD = re.compile(r"[A-Za-zÀ-ÿ']+")

# Abbreviations and product names that legitimately use internal capitals.
ALLOWED_CAPS = {
    "IRPF", "IA", "PDF", "URL", "HTML", "RSS", "SSG", "API", "SEO",
    "Copilot", "ChatGPT", "Chat", "Microsoft", "Google", "Gemini", "Claude",
}


def latin_suspects(text, lang):
    """Words that look Spanish but contain a root that is not a Spanish word.

    Spanish is written without internal capital letters, so any word with an
    uppercase letter in the middle is a copy from a headline or a foreign text.
    """
    suspects = []
    for i, line in enumerate(text.split("\n")):
        if line.strip() == "---":
            continue
        for w in WORD.findall(line):
            # Skip the first letter: normal capitalisation at a sentence start.
            if len(w) > 1 and any(c.isupper() for c in w[1:]):
                if w in ALLOWED_CAPS or w.upper() in ALLOWED_CAPS:
                    continue
                suspects.append((i + 1, w))
    return suspects


def check_lang(lang, source_lang="ko"):
    src_dir = os.path.join(ROOT, "content", "posts")
    lang_dir = os.path.join(ROOT, "content", "posts", lang)
    if not os.path.isdir(lang_dir):
        print("[%s] directory not found" % lang)
        return 1

    problems = []
    files = sorted(glob.glob(os.path.join(lang_dir, "*.md")))
    for path in files:
        rel = os.path.relpath(path, ROOT).replace("\\", "/")
        text = open(path, encoding="utf-8").read()

        if not text.startswith("---"):
            problems.append((rel, 1, "missing frontmatter"))

        lines = text.split("\n")
        in_fm = False
        for i, line in enumerate(lines):
            if line.strip() == "---":
                in_fm = not in_fm
                continue
            if not in_fm:
                hit = CJK.findall(line)
                if hit:
                    problems.append((rel, i + 1, "stray CJK: " + "".join(hit)[:20]))
                # English filler leaking into a Spanish body
                words = [w.lower() for w in re.findall(r"\b[a-z']+\b", line)]
                if lang == "es":
                    hits = [w for w in words if w in EN_STOPWORDS]
                    if len(hits) >= 3:
                        problems.append((rel, i + 1, "English words: " + " ".join(hits[:6])))

        sus = latin_suspects(text, lang)
        for ln, w in sus:
            problems.append((rel, ln, "odd internal capital: " + w))

    print("[%s] %d files checked, %d problems" % (lang, len(files), len(problems)))
    for rel, line, msg in problems:
        print("   %s:%d  %s" % (rel, line, msg))
    return len(problems)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    langs = [a for a in sys.argv[1:] if not a.startswith("-")]
    if not langs:
        langs = [d for d in ("en", "ja", "zh", "es")
                 if os.path.isdir(os.path.join(ROOT, "content", "posts", d))]
    total = 0
    for lg in langs:
        total += check_lang(lg)
    print("\nTOTAL PROBLEMS:", total)
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())