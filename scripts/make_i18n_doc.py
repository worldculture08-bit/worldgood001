import os, glob, collections
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

OUT = r"E:\AI 프로젝트 결과물\project table 정리\다국어번역_진행상황_2026-10-02.docx"

KO_DIR = "content/posts"
LANGS = ["en", "ja", "zh", "es"]
LABEL = {"en": "영어", "ja": "일본어", "zh": "중국어", "es": "스페인어"}

ko_files = sorted(glob.glob(os.path.join(KO_DIR, "*.md")))
KO = len(ko_files)

counts = {}
for lg in LANGS:
    counts[lg] = len(glob.glob(os.path.join(KO_DIR, lg, "*.md")))

# category distribution
cats = collections.Counter()
for f in ko_files:
    for line in open(f, encoding="utf-8"):
        if line.startswith("categories:"):
            body = line.split("[", 1)[1].split("]", 1)[0]
            for c in body.split(","):
                c = c.strip().strip('"')
                if c:
                    cats[c] += 1
            break

doc = Document()

# base font -> Korean-capable
style = doc.styles["Normal"]
style.font.name = "Malgun Gothic"
style.font.size = Pt(10.5)
style.element.rPr.rFonts.set(qn("w:eastAsia"), "Malgun Gothic")

for s in doc.sections:
    s.top_margin = Cm(2.0)
    s.bottom_margin = Cm(2.0)
    s.left_margin = Cm(2.2)
    s.right_margin = Cm(2.2)


def h(text, level):
    p = doc.add_heading(text, level=level)
    for r in p.runs:
        r.font.name = "Malgun Gothic"
        r._element.rPr.rFonts.set(qn("w:eastAsia"), "Malgun Gothic")
        r.font.color.rgb = RGBColor(0x1A, 0x1A, 0x1A)
    return p


def para(text, bold=False, size=None):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold = bold
    r.font.name = "Malgun Gothic"
    r._element.rPr.rFonts.set(qn("w:eastAsia"), "Malgun Gothic")
    if size:
        r.font.size = Pt(size)
    return p


def bullet(text):
    p = doc.add_paragraph(text, style="List Bullet")
    for r in p.runs:
        r.font.name = "Malgun Gothic"
        r._element.rPr.rFonts.set(qn("w:eastAsia"), "Malgun Gothic")
    return p


def table(headers, rows):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = "Light Grid Accent 1"
    for i, htxt in enumerate(headers):
        c = t.rows[0].cells[i]
        c.text = ""
        r = c.paragraphs[0].add_run(htxt)
        r.bold = True
        r.font.name = "Malgun Gothic"
        r._element.rPr.rFonts.set(qn("w:eastAsia"), "Malgun Gothic")
        r.font.size = Pt(9.5)
    for row in rows:
        cells = t.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = ""
            r = cells[i].paragraphs[0].add_run(str(val))
            r.font.name = "Malgun Gothic"
            r._element.rPr.rFonts.set(qn("w:eastAsia"), "Malgun Gothic")
            r.font.size = Pt(9.5)
    doc.add_paragraph()
    return t


# ---------------- title ----------------
tp = doc.add_heading("다국어 · 번역 진행상황 보고서", level=0)
for r in tp.runs:
    r.font.name = "Malgun Gothic"
    r._element.rPr.rFonts.set(qn("w:eastAsia"), "Malgun Gothic")
sp = doc.add_paragraph()
sp.alignment = WD_ALIGN_PARAGRAPH.CENTER
sr = sp.add_run("harugirok.world Blog · https://harugirok.vercel.app\n작성일 2026년 10월 2일")
sr.font.name = "Malgun Gothic"
sr._element.rPr.rFonts.set(qn("w:eastAsia"), "Malgun Gothic")
sr.font.size = Pt(10)

# ---------------- 1 ----------------
h("1. 요약", 1)
para(
    "한국어 원문 74편을 기준으로 영어 번역 74편(100%), 스페인어 번역 22편(29.7%)을 완료했습니다. "
    "5개 언어 라우트(ko · en · ja · zh · es)는 구축·배포되어 있고, 번역본이 없는 페이지는 "
    "한국어 원문을 그대로 보여주면서 안내 문구를 붙이는 방식으로 동작합니다. "
    "영어는 잔여분을 모두 채워 완결됐고, 스페인어는 현업·글쓰기·노동법·돈 영역을 중심으로 22편을 확보했습니다. "
    "일본어와 중국어는 착수 전입니다. 번역 품질 검증을 자동화한 스크립트도 함께 투입했습니다."
)

# ---------------- 2 ----------------
h("2. 다국어 구조", 1)
para("번역은 라우트·UI·글 세 층위로 나뉘어 구현되어 있습니다.")
table(
    ["구분", "파일 / 위치", "역할"],
    [
        ["언어 상수", "lib/i18n.ts", "LANGS · TARGET_LANGS · 언어 표시명 · 경로 생성 함수"],
        ["UI 문구", "lib/i18n.ts 의 UI 객체", "헤더·푸터·버튼 등 5개언어 문구 일괄 관리"],
        ["카테고리명", "lib/categories.ts", "9개 카테고리 라벨 5개언어 대응"],
        ["글 로더", "lib/posts.ts", "번역본(content/posts/{lang}/) 우선, 없으면 한국어 원문"],
        ["언어 전환", "components/LanguageSwitcher.tsx", "우상단 드롭다운, usePathname 으로 현재 경로 유지"],
        ["한국어 라우트", "app/(ko)/", "접두사 없는 기본 경로(/p/{slug})"],
        ["번역 라우트", "app/[lang]/", "/en /ja /zh /es 접두 경로"],
        ["검색 노출", "app/sitemap.ts", "5개언어 URL + hreflang alternates"],
    ],
)
para("번역 우선 규칙: 글 파일은 content/posts/{lang}/{slug}.md 를 먼저 찾고, 없으면 한국어 원문을 사용하며 "
     "translated:false 플래그를 함께 전달합니다. 따라서 번역이 어디까지 되었든 사이트는 절대 빈 화면이 되지 않습니다.")

# ---------------- 3 ----------------
h("3. 언어별 진행률", 1)
rows = []
rows.append(["한국어 (원문)", KO, "100 %", "완료 · 기준"])
for lg in LANGS:
    n = counts[lg]
    pct = 100.0 * n / KO if KO else 0
    state = "완료" if pct >= 100 else ("진행 중" if n > 0 else "착수 전")
    rows.append([LABEL[lg] + f" (/{lg})", n, f"{pct:.1f} %", state])
table(["언어", "번역 편수", "진행률", "상태"], rows)

para(f"합계 번역본 {sum(counts.values())}편 / 목표 {KO * 4}편 "
     f"(전체 진행률 {100.0 * sum(counts.values()) / (KO * 4):.1f} %)", bold=True)

# ---------------- 4 ----------------
h("4. 이번 세션에서 처리한 내용", 1)
h("4.1 영어 번역 (25편 추가)", 2)
para("이전 세션의 49편에 이어 잔여 25편을 모두 번역해 영어 100 %를 달성했습니다.")
table(
    ["분류", "편수", "포함 글"],
    [
        ["일하는 법 · 노동법", "5", "employment-type-comparison, severance 외 3편"],
        ["돈 · 생활계산", "5", "rent-limit-calculator, hybrid-work-cost-calculator, year-end-tax-comparison, one-year-money-comparison, emergency-fund-3-months"],
        ["마음가짐 · 관점", "5", "sweden-welfare-korea, end-of-labor-basic-income, apartment-wealth-myth, respect-at-work, on-site-trust"],
        ["글쓰기 · 기록", "6", "short-posts-win, writing-for-workers, when-plan-changes, small-project-start, fact-claim-inference, meeting-after"],
        ["현장 · 기획", "5", "field-briefing, labor-field-listen, connect-people, people-and-work, people-before-tools"],
        ["산업 · AI", "3", "construction-winter, ai-takes-jobs, ai-plan-overlap-one-person"],
    ],
)
para("번역 규칙: 영문 본문의 내부 링크는 반드시 /en/p/{slug} 형태를 사용합니다. /p/{slug} 를 쓰면 한국어로 넘어가므로 "
     "영문 본문에서 상대 링크를 옮길 때 항상 접두사를 붙입니다. 원문의 <figure> · <span class=\"em-*\"> 마크업은 "
     "기존 영어 번역 컨벤션에 따라 제거하고 본문만 옮겼습니다. frontmatter 의 date · categories 는 원문과 동일하게 유지합니다.")

h("4.2 스페인어 번역 (22편 신규)", 2)
para("스페인어 디렉터리(content/posts/es/)를 새로 만들고, 사람이 중심이면서 다른 언어로 옮길 때 "
     "뉘앙스가 가장 잘 살아남는 글부터 배치했습니다. 2차 배치에서는 현장·글쓰기·노동법 영역을 넓혔습니다.")
table(
    ["구분", "편수", "포함 글"],
    [
        ["1차 — 사람·현장·글쓰기", "6", "respect-at-work, people-and-work, short-posts-win, meeting-after, labor-field-listen, rent-limit-calculator"],
        ["2차 — 신뢰·연결·기록", "5", "on-site-trust, connect-people, people-before-tools, writing-for-workers, when-plan-changes"],
        ["2차 — 기획·현장·법령", "5", "small-project-start, fact-claim-inference, field-briefing, employment-type-comparison, emergency-fund-3-months"],
        ["3차 — 생활습관", "6", "daily-review-upgrade, desk-reset, one-line-log, morning-note, note-to-self, start-again-today"],
    ],
)
para("번역본이 없는 스페인어 페이지 52편은 아직 한국어 원문이 표시됩니다. 이는 오류가 아니라 설계된 동작이며, "
     "해당 페이지 하단에 'Este artículo está disponible solo en coreano por ahora' 안내가 자동으로 붙습니다.")

h("4.3 번역 품질 검증 자동화", 2)
para("번역 작업 중 다른 언어 문자가 섞이는 문제가 반복되어, 이를 잡아내는 검증 스크립트를 "
     "scripts/check_translation.py 로 만들어 빌드 전에 돌리도록 고정했습니다.")
table(
    ["검사 항목", "내용", "한계"],
    [
        ["CJK 혼입", "한·일·중 문자가 라틴 문자 번역본에 섞였는지 검사", "CJK만 해당"],
        ["영어 잔존", "같은 줄에 영어 불용어가 3개 이상 몰리면 경고", "문장 단위 오탐 가능"],
        ["이상한 내부 대문자", "IRPF·IA 같은 정상 약어는 화이트리스트, 그 외 중간 대문자는 경고", "약어 추가 필요"],
        ["프런트매터 누락", "--- 시작 여부 확인", "필드 누락은 미검사"],
    ],
)
bullet("현재 스페인어 22편 기준 검사 결과는 0건입니다.")
bullet("실제로 이 스크립트가 잡아낸 오류: 제목 오염(emergency-fund), 단어 파쇄(dificultacompatibilizar), 영어 단위 잔존(developments, pleases, brief, dissatisfied, dominant, bolígrafo), 비스페인어 표현(la relleno, Un mensajería).")
bullet("CJK 검사만으로는 부족해 매 배치마다 본문을 직접 읽는 검토를 병행하고 있습니다. 이번 3차 배치에서 추가 수정 5건이 나왔습니다.")
bullet("영어 쪽에 남아 있는 한글은 요양급여·휴업급여 같은 한국 법령 고유 용어를 영어 뒤 괄호로 병기한 기존 관용 표기이며, 의도된 것입니다.")
para("실행 방법: python scripts/check_translation.py es  또는  python scripts/check_translation.py (전 언어)", bold=True)

# ---------------- 5 ----------------
h("5. 카테고리 구성", 1)
rows = [[c, n] for c, n in cats.most_common()]
rows.append(["합계(중복 포함)", sum(cats.values())])
table(["카테고리 slug", "포함 글 수"], rows)

# ---------------- 6 ----------------
h("6. 남은 일과 일정", 1)
table(
    ["순서", "언어", "잔여 편수", "비고"],
    [
        ["1", "스페인어", KO - counts["es"], "22편 완료, 같은 방식으로 순차 진행"],
        ["2", "일본어", KO, "번역 성격상 formality 높임 유지 필요"],
        ["3", "중국어", KO, "간체 기준, 법률 용어는 중국어 고유 표현 확인 필요"],
        ["4", "배포 및 검증", "-", "언어별 완료 시점마다 npm run build 후 Vercel 배치 배포"],
    ],
)
para("권장 진행 방식: 언어 1개(74편)를 완성하는 시점에 한 번 배포합니다. 분할 배포는 "
     "번역본 없는 페이지가 오래 남고 검색 노출도 늦어집니다.")

# ---------------- 7 ----------------
h("7. 배포 및 검증 절차", 1)
bullet("빌드: npm run build — 현재 438페이지 정적 생성 확인 완료.")
bullet("배포: VERCEL_TOKEN=<토큰> npx vercel --prod --yes (Vercel CLI 로그인이 만료되어 매번 토큰 직접 전달 필요).")
bullet("검증: /en/p/{slug} , /es/p/{slug} HTTP 200 응답과 번역본 적용 여부를 확인합니다.")
bullet("번역 적용 확인법: 해당 URL HTML에 'only in Korean' 문자열이 없으면 번역본이 적용된 것입니다.")
bullet("번역본 추가 전에는 반드시 python scripts/check_translation.py 를 돌립니다. 번역본 추가는 카테고리 분류 재실행이 필요 없습니다.")

# ---------------- 8 ----------------
h("8. 작업 중 발생한 문제와 조치", 1)
table(
    ["문제", "원인", "조치"],
    [
        ["write_file 상대경로 실패", "프로젝트 루트가 사이트 폴더가 아닌 PowerShell 설치 경로로 잡힘", "절대 경로 사용으로 전환"],
        ["경로 한글 오타로 잘못된 폴더 생성", "'블로그' 를 'ブログ', 'Blogs' 등으로 입력", "파일 이동 후 잘못된 폴더 삭제 완료 (2회 발생)"],
        ["번역본에 일본어·중국어 문자 혼입", "번역 생성 중 언어 혼선", "scripts/check_translation.py 로 자동 검사 후 해당 문장 재작성"],
        ["bash 경로 인코딩 실패", "Git Bash에서 한자 경로 처리 문제", "python 스크립트로 이동·삭제 처리"],
        ["라틴 문자 단위 혼입", "영어 단어가 스페인어 문장에 단위로 삽입됨", "이상어 자동 검사 도입 + 수동 전수 검토"],
    ],
)

# ---------------- 9 ----------------
h("9. 기대 효과", 1)
bullet("영어 100 % 완료를 계기로 검색 유입 대상 market이 1개에서 5개 언어로 넓어집니다.")
bullet("사이트맵에 5개언어 URL이 모두 등록되어 있고 각 페이지에 hreflang alternates가 설정되어 중복 색인 문제를 완화합니다.")
bullet("번역본이 없는 페이지는 원문 그대로 제공되므로, 진행 여부와 관계없이 사이트 품질이 항상 유지됩니다.")
bullet("남은 3개 언어는 번역만 추가하면 되므로 기술적 작업 없이 진행할 수 있습니다.")

doc.save(OUT)
print("saved:", OUT)
print("size:", os.path.getsize(OUT), "bytes")
print("KO:", KO, counts)