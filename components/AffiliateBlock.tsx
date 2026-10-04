
export type AffiliateLink = {
  name: string;
  url: string;
  note?: string;
};

type Props = {
  links: AffiliateLink[];
};

/**
 * 제휴(어필리에이트) 링크 블록.
 *
 * Google AdSense 정책상 제휴 링크로 수익을 받는다면 그 사실을 본문에 밝혀야 한다.
 * 그래서 링크 카드 위에 고지 문구를 항상 첫 줄로 붙인다 — 선택지가 아니다.
 * 애드센스 심사에서 "광고와 편집의 분리"를 확인할 자리이기도 하다.
 */
export default function AffiliateBlock({ links }: Props) {
  if (links.length === 0) return null;

  return (
    <section
      aria-labelledby="affiliate-heading"
      className="my-8 rounded-xl border border-accent/30 bg-accent-soft/50 p-5"
    >
      <h2 id="affiliate-heading" className="font-serif text-base font-semibold text-ink-900">
        함께 써본 도구
      </h2>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-700">
        아래 링크를 통해 가입·구매하면 그 일정액이 이 블로그 운영에 사용됩니다.
        그래서 광고가 붙었다고 해당 상품을 추천하는 것은 아닙니다. 실제로 쓰지 않은
        제품은 올리지 않습니다.
      </p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="block rounded-lg border border-ink-200 bg-white p-3 transition hover:border-accent/50"
            >
              <span className="font-medium text-ink-900 underline decoration-accent/40 underline-offset-4">
                {l.name}
              </span>
              {l.note ? (
                <span className="mt-1 block text-xs text-ink-700">{l.note}</span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}