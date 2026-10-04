// 카테고리 — slug는 frontmatter categories 값과 동일
// 라벨은 5개 언어를 지원한다 (기본 ko).
//
// 정렬 기준: 수익 잠재력(monetization) 내림차순.
//   "돈·생활 경제"처럼 검색 의도가 명확하고 광고 단가가 붙는 주제
//   (전세·연금·세금·주거·투자)를 먼저 노출하고, 기록·마음가짐 계열은 뒤로 보낸다.
//   이 정렬이 홈 사이드바·카테고리 목록·다음 글 추천의 노출 순서를 결정한다.
import { DEFAULT_LANG, type Lang } from "@/lib/i18n";

const LABELS: Record<Lang, Record<string, string>> = {
  ko: {
    // ── 수익 카테고리 (검색 의도 + 광고 단가) ──
    jeonse: "전세·보증금",
    pension: "연금저축·연금",
    tax: "세금·연말정산",
    housing: "주거·부동산",
    "money-invest": "저축·투자·금리",
    // ── 기존 카테고리 ──
    "labor-law": "노동법·급여",
    "ai-tools": "AI·디지털 도구",
    "work-life": "일하는 법·협업",
    "labor-world": "노동·산업",
    "habit-record": "습관·기록·회고",
    "writing-blog": "글쓰기·블로그",
    mindset: "마음가짐",
    planning: "기획·프로젝트",
    "money-life": "돈·생활 경제",
    other: "기타",
  },
  en: {
    jeonse: "Jeonse & Deposits",
    pension: "Pension Savings",
    tax: "Tax & Year-End Filing",
    housing: "Housing & Real Estate",
    "money-invest": "Saving & Investing",
    "labor-law": "Labor Law & Pay",
    "ai-tools": "AI & Digital Tools",
    "work-life": "Working with Others",
    "labor-world": "Labor & Industry",
    "habit-record": "Habits & Records",
    "writing-blog": "Writing & Blogging",
    mindset: "Mindset",
    planning: "Planning & Projects",
    "money-life": "Money & Everyday Life",
    other: "Other",
  },
  ja: {
    jeonse: "전세・敷金",
    pension: "年金・退職年金",
    tax: "税金・年末調整",
    housing: "住居・不動産",
    "money-invest": "貯蓄・投資・金利",
    "labor-law": "労働法・賃金",
    "ai-tools": "AI・デジタルツール",
    "work-life": "働く人と協働",
    "labor-world": "労働・産業",
    "habit-record": "習慣・記録・ふりかえり",
    "writing-blog": "文章・ブログ",
    mindset: "心の構え",
    planning: "企画・プロジェクト",
    "money-life": "お金・生活経済",
    other: "その他",
  },
  zh: {
    jeonse: "全租·押金",
    pension: "养老金储蓄",
    tax: "税务·年终汇算",
    housing: "住房·不动产",
    "money-invest": "储蓄·投资·利率",
    "labor-law": "劳动法与工资",
    "ai-tools": "AI 与数字工具",
    "work-life": "工作与合作",
    "labor-world": "劳动与产业",
    "habit-record": "习惯与记录",
    "writing-blog": "写作与博客",
    mindset: "心态",
    planning: "策划与项目",
    "money-life": "金钱与生活经济",
    other: "其他",
  },
  es: {
    jeonse: "Alquiler con fianza (jeonse)",
    pension: "Jubilación y ahorro",
    tax: "Impuestos y declaración",
    housing: "Vivienda e inmobiliaria",
    "money-invest": "Ahorro e inversión",
    "labor-law": "Derecho laboral y salario",
    "ai-tools": "IA y herramientas digitales",
    "work-life": "Trabajo y colaboración",
    "labor-world": "Trabajo e industria",
    "habit-record": "Hábitos y registro",
    "writing-blog": "Escritura y blog",
    mindset: "Mentalidad",
    planning: "Planificación y proyectos",
    "money-life": "Dinero y economía doméstica",
    other: "Otros",
  },
};


export const CATEGORY_LABELS = LABELS[DEFAULT_LANG];

/**
 * 수익 잠재력(0=돈 없음, 3=높음). 홈·사이드바 정렬과 다음 글 추천 가중에 쓴다.
 * 새 카테고리를 만들 때 값을 지정하지 않으면 0으로 본다.
 */
const MONETIZATION: Record<string, number> = {
  jeonse: 3,
  pension: 3,
  tax: 3,
  housing: 3,
  "money-invest": 3,
  "ai-tools": 2, // SaaS·도구 어필리이트 단가가 붙는다
  "labor-law": 2,
  "labor-world": 1,
  "money-life": 1,
  "work-life": 0,
  "writing-blog": 0,
  planning: 0,
  "habit-record": 0,
  mindset: 0,
  other: 0,
};

export function monetizationScore(slug: string): number {
  return MONETIZATION[slug] ?? 0;
}

export function categoryLabel(slug: string, lang: Lang = DEFAULT_LANG): string {
  return LABELS[lang]?.[slug] ?? LABELS[DEFAULT_LANG][slug] ?? slug;
}

export function categoryLabels(slugs: string[], lang: Lang = DEFAULT_LANG): string[] {
  return slugs.map((s) => categoryLabel(s, lang));
}