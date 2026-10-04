// 다국어 기반 — 한국어(ko)가 기본, en/ja/zh/es 를 경로 접두사로 쓴다.
// ko 는 접두사 없이 /p/slug, 그 외는 /en/p/slug 형태.

export const LANGS = ["ko", "en", "ja", "zh", "es"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "ko";
export const TARGET_LANGS: Lang[] = ["en", "ja", "zh", "es"];

// 헤더 버튼에 보이는 언어 이름 (자기 언어로는 표시)
export const LANG_LABELS: Record<Lang, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
  es: "Español",
};

// 버튼 안 짧은 라벨 (2글자)
export const LANG_SHORT: Record<Lang, string> = {
  ko: "KR",
  en: "EN",
  ja: "JP",
  zh: "CN",
  es: "ES",
};

// 각 언어의 BCP47 (날짜 포맷·html lang 속성용)
export const LANG_LOCALE: Record<Lang, string> = {
  ko: "ko-KR",
  en: "en",
  ja: "ja-JP",
  zh: "zh-CN",
  es: "es",
};

export function isLang(x: string): x is Lang {
  return (LANGS as readonly string[]).includes(x);
}

/** ko 는 접두사가 없다. */
export function langPrefix(lang: Lang): string {
  return lang === DEFAULT_LANG ? "" : `/${lang}`;
}

export function homePath(lang: Lang): string {
  return langPrefix(lang) || "/";
}

export function postPath(slug: string, lang: Lang): string {
  return `${langPrefix(lang)}/p/${slug}`;
}

export function categoryPath(category: string, lang: Lang): string {
  return `${langPrefix(lang)}/c/${category}`;
}

export function aboutPath(lang: Lang): string {
  return `${langPrefix(lang)}/about`;
}

export function contactPath(lang: Lang): string {
  return `${langPrefix(lang)}/contact`;
}

export function privacyPath(lang: Lang): string {
  return `${langPrefix(lang)}/privacy`;
}

export function termsPath(lang: Lang): string {
  return `${langPrefix(lang)}/terms`;
}

/**
 * 현재 경로를 다른 언어로 바꿔 준다.
 * /p/foo → /en/p/foo, /en/c/labor-law → /ja/c/labor-law, / → /ja
 */
export function switchLangInPath(pathname: string, next: Lang): string {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length && isLang(segs[0])) {
    segs.shift();
  }
  const rest = segs.length ? `/${segs.join("/")}` : "";
  if (next === DEFAULT_LANG) return rest || "/";
  return `/${next}${rest}`;
}

// 번역본이 없을 때 글 상단에 붙일 안내 문구
const NOT_TRANSLATED: Record<Lang, string> = {
  ko: "",
  en: "This article is currently available only in Korean.",
  ja: "この記事はまだ韓国語のみで公開されています。",
  zh: "这篇文章目前仅提供韩文版本。",
  es: "Este artículo está disponible solo en coreano por ahora.",
};

export function notTranslatedNote(lang: Lang): string {
  return NOT_TRANSLATED[lang];
}

// 헤더·푸터·홈 등 고정 UI 문구
export type UIKey =
  | "navMain"
  | "navAbout"
  | "navJoin"
  | "navLogin"
  | "navAdmin"
  | "footerPrivacy"
  | "footerTerms"
  | "footerContact"
  | "footerRights"
  | "langLabel"
  | "relatedPosts"
  | "postsInCategory"
  | "backToList"
  | "writtenBy"
  | "humanReviewed"
  | "homeKicker"
  | "homeTitle"
  | "homeIntro"
  | "readLatest"
  | "readFirst"
  | "aboutSpace"
  | "postsCount"
  | "latestNotes"
  | "stillCollecting"
  | "categoriesTitle"
  | "startHere"
  | "startHereBody"
  | "whyWrite"
  | "allPosts"
  | "pageNotReady"
  | "pageNotReadyBody";

const UI: Record<Lang, Record<UIKey, string>> = {
  ko: {
    navMain: "AI·업무",
    navAbout: "소개",
    navJoin: "가입",
    navLogin: "로그인",
    navAdmin: "관리",
    footerPrivacy: "개인정보처리방침",
    footerTerms: "이용약관",
    footerContact: "문의",
    footerRights: "모든 글은 한국어로 먼저 쓰고, 사람이 검토한 뒤에 올립니다.",
    langLabel: "언어",
    relatedPosts: "관련 글",
    postsInCategory: "이 주제의 기록",
    backToList: "← 글 목록",
    writtenBy: "글쓴이",
    humanReviewed: "사람 검토 후 게시",
    homeKicker: "하루기록 · 현장 노트",
    homeTitle: "하루를 기록하고, 다음 행동으로 바꾸는 공간",
    homeIntro:
      "하루의 기록과 현장의 문제를 AI 실무·노동·사람의 시점에서 읽고, 다시 쓸 수 있게 정리하는 공간입니다. 현장의 작은 관찰과 AI 실무 실험을 다시 찾을 수 있는 글로 남깁니다.",
    readLatest: "최신 기록 읽기",
    readFirst: "첫 기록 읽기",
    aboutSpace: "이 공간 소개",
    postsCount: "기록·실험 {n}편",
    latestNotes: "최근 기록",
    stillCollecting: "계속 쌓는 중",
    categoriesTitle: "카테고리",
    startHere: "이런 기록부터 보세요",
    startHereBody:
      "하루의 기록, 현장의 판단, 노동과 사람의 문제, AI를 검증하는 방법을 한곳에서 이어 봅니다.",
    whyWrite: "왜 기록하는지 보기 →",
    allPosts: "← 모든 글 보기",
    pageNotReady: "이 페이지는 아직 번역되지 않았습니다.",
    pageNotReadyBody: "아래는 한국어 원문입니다. 번역이 준비되면 해당 언어로 다시 제공합니다.",
  },
  en: {
    navMain: "AI & Work",
    navAbout: "About",
    navJoin: "Join",
    navLogin: "Log in",
    navAdmin: "Admin",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms",
    footerContact: "Contact",
    footerRights: "Every post is written in Korean first and published only after human review.",
    langLabel: "Language",
    relatedPosts: "Related posts",
    postsInCategory: "posts in this topic",
    backToList: "← All posts",
    writtenBy: "Written by",
    humanReviewed: "Human reviewed",
    homeKicker: "Daily log · Field notes",
    homeTitle: "Record the day, turn it into the next action",
    homeIntro:
      "A place to read the day's records and problems on the ground through the lens of AI practice, work and people — and to organize them so they can be used again. Small field observations and AI experiments are kept here as posts you can come back to.",
    readLatest: "Read the latest",
    readFirst: "Read the first post",
    aboutSpace: "About this space",
    postsCount: "{n} posts",
    latestNotes: "Latest posts",
    stillCollecting: "Still growing",
    categoriesTitle: "Categories",
    startHere: "Start here",
    startHereBody:
      "Daily records, judgment calls on the ground, problems of work and people, and how to verify AI — all in one place.",
    whyWrite: "Why we write →",
    allPosts: "← All posts",
    pageNotReady: "This page has not been translated yet.",
    pageNotReadyBody: "The Korean original is shown below. It will be provided in this language once the translation is ready.",
  },
  ja: {
    navMain: "AI・仕事",
    navAbout: "紹介",
    navJoin: "入会",
    navLogin: "ログイン",
    navAdmin: "管理",
    footerPrivacy: "プライバシーポリシー",
    footerTerms: "利用規約",
    footerContact: "お問い合わせ",
    footerRights: "すべての記事は、まず韓国語で書き、人による確認を経て公開しています。",
    langLabel: "言語",
    relatedPosts: "関連記事",
    postsInCategory: "このテーマの記事",
    backToList: "← 記事一覧",
    writtenBy: "執筆",
    humanReviewed: "人が確認して公開",
    homeKicker: "하루기록・現場ノート",
    homeTitle: "一日を記録して、次の行動に変える場所",
    homeIntro:
      "一日の記録と現場の課題を、AI実務・労働・人の視点から読み、もう使える形に整理する場所です。現場の小さな観察とAI実務の実験を、あとで読み返せる記事として残しています。",
    readLatest: "最新記事を読む",
    readFirst: "最初の記事を読む",
    aboutSpace: "この場所について",
    postsCount: "記録・実験 {n}件",
    latestNotes: "最近の記事",
    stillCollecting: "増やし建设中",
    categoriesTitle: "カテゴリー",
    startHere: "まずこちらへ",
    startHereBody:
      "一日の記録、現場での判断、労働と人の問題、AIを確かめる方法を、ひとつの場所でつなぎます。",
    whyWrite: "なぜ記録するか見る →",
    allPosts: "← 記事一覧",
    pageNotReady: "このページはまだ翻訳されていません。",
    pageNotReadyBody: "下には韓国語の原文を表示しています。翻訳ができたら、この言語で提供します。",
  },
  zh: {
    navMain: "AI·工作",
    navAbout: "关于",
    navJoin: "加入",
    navLogin: "登录",
    navAdmin: "管理",
    footerPrivacy: "隐私政策",
    footerTerms: "使用条款",
    footerContact: "联系",
    footerRights: "所有文章先用韩文撰写，经人工审核后发布。",
    langLabel: "语言",
    relatedPosts: "相关文章",
    postsInCategory: "该主题的文章",
    backToList: "← 文章列表",
    writtenBy: "作者",
    humanReviewed: "经人工审核后发布",
    homeKicker: "日常记录 · 现场笔记",
    homeTitle: "记录一天，把它变成下一个行动",
    homeIntro:
      "从 AI 实务、劳动与人性的角度阅读当天的记录与现场问题，并整理成可以再次使用的形式。这里保留着现场的细小观察和 AI 实务实验，方便日后重读。",
    readLatest: "阅读最新文章",
    readFirst: "阅读第一篇",
    aboutSpace: "关于这里",
    postsCount: "记录·实验 {n} 篇",
    latestNotes: "最新文章",
    stillCollecting: "持续积累中",
    categoriesTitle: "分类",
    startHere: "先看这些",
    startHereBody:
      "一天的记录、现场中的判断、劳动与人的问题，以及如何验证 AI，都在一个地方连起来。",
    whyWrite: "为什么记录 →",
    allPosts: "← 全部文章",
    pageNotReady: "此页面尚未翻译。",
    pageNotReadyBody: "下方显示韩文原文。翻译完成后将以此语言提供。",
  },
  es: {
    navMain: "IA y trabajo",
    navAbout: "Acerca de",
    navJoin: "Unirse",
    navLogin: "Entrar",
    navAdmin: "Admin",
    footerPrivacy: "Política de privacidad",
    footerTerms: "Términos",
    footerContact: "Contacto",
    footerRights: "Cada artículo se escribe primero en coreano y se publica solo después de la revisión humana.",
    langLabel: "Idioma",
    relatedPosts: "Artículos relacionados",
    postsInCategory: "artículos en este tema",
    backToList: "← Todos los artículos",
    writtenBy: "Escrito por",
    humanReviewed: "Revisado por una persona",
    homeKicker: "Registro diario · Notas de campo",
    homeTitle: "Registrar el día y convertirlo en la siguiente acción",
    homeIntro:
      "Un lugar para leer los registros del día y los problemas del terreno desde la práctica de la IA, el trabajo y las personas, y ordenarlos para volver a usarlos. Aquí quedan las pequeñas observaciones del terreno y los experimentos con IA, como artículos a los que volver.",
    readLatest: "Leer lo más reciente",
    readFirst: "Leer el primer artículo",
    aboutSpace: "Sobre este espacio",
    postsCount: "{n} registros y experimentos",
    latestNotes: "Artículos recientes",
    stillCollecting: "Seguimos añadiendo",
    categoriesTitle: "Categorías",
    startHere: "Empieza por aquí",
    startHereBody:
      "Registros del día, decisiones en el terreno, los problemas del trabajo y las personas, y cómo verificar la IA: todo en un mismo sitio.",
    whyWrite: "Por qué escribimos →",
    allPosts: "← Todos los artículos",
    pageNotReady: "Esta página aún no está traducida.",
    pageNotReadyBody:
      "Se muestra el original en coreano. Se proporcionará en este idioma cuando la traducción esté lista.",
  },
};

export function t(lang: Lang, key: UIKey): string {
  return UI[lang]?.[key] ?? UI[DEFAULT_LANG][key];
}

export function tCount(lang: Lang, key: UIKey, n: number): string {
  return t(lang, key).replace("{n}", String(n));
}

/** 홈 상단 카드 4개 — [라벨, 제목, slug] */
export const FEATURED: Record<Lang, [string, string, string][]> = {
  ko: [
    ["하루 기록", "하루 한 줄, 가장 게으른 기록법", "one-line-log"],
    ["AI 실무", "업무 자동화, 도구보다 먼저 정할 5단계", "ai-work-automation-checklist"],
    ["AI 도구 비교", "업무용 AI, 무엇을 어디에 쓰는가", "ai-assistant-comparison-ko"],
    ["비용 점검", "겹치는 구독료, 분기 점검표", "ai-subscription-audit"],
  ],
  en: [
    ["Daily log", "One line a day: the laziest way to record", "one-line-log"],
    ["AI in practice", "5 steps to decide before you automate", "ai-work-automation-checklist"],
    ["AI tools compared", "Which work AI goes where", "ai-assistant-comparison-ko"],
    ["Cost review", "Overlapping subscriptions, quarterly checklist", "ai-subscription-audit"],
  ],
  ja: [
    ["日々の記録", "1日1行がいちばん楽な記録法", "one-line-log"],
    ["AI 実務", "自動化より先に決める5ステップ", "ai-work-automation-checklist"],
    ["AIツール比較", "業務AIは何に使うか", "ai-assistant-comparison-ko"],
    ["コスト点検", "重複サブスク、四半期点検表", "ai-subscription-audit"],
  ],
  zh: [
    ["日常记录", "每天一行，最省力的记录法", "one-line-log"],
    ["AI 实务", "比自动化更该先决定的 5 个步骤", "ai-work-automation-checklist"],
    ["AI 工具对比", "办公 AI 该用在哪里", "ai-assistant-comparison-ko"],
    ["成本检查", "重复订阅，季度检查表", "ai-subscription-audit"],
  ],
  es: [
    ["Registro diario", "Una línea al día: la forma más perezosa de registrar", "one-line-log"],
    ["IA en la práctica", "5 pasos antes de automatizar", "ai-work-automation-checklist"],
    ["Comparativa de herramientas de IA", "Qué IA para cada tarea", "ai-assistant-comparison-ko"],
    ["Revisión de costes", "Suscripciones duplicadas, lista trimestral", "ai-subscription-audit"],
  ],
};