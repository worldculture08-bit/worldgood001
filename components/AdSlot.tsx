import {
  adClient,
  adCollapsesWhenMissing,
  adFormat,
  adMinHeight,
  adSlotId,
  type AdSlotName,
} from "@/lib/ads";

type AdSlotProps = {
  slot: AdSlotName;
  className?: string;
  /**
   * 승인 전(클라이언트 ID 미설정)에 안내 박스를 남길지.
   * 기본 false — 남겨두면 CLS가 생기고 "빈 자리"로 보여 승인 거절 사유가 된다.
   */
  showPlaceholder?: boolean;
};

const LABELS: Record<AdSlotName, string> = {
  banner: "배너 광고",
  sidebar: "사이드바 광고",
  "in-article": "본문 중간 광고",
  "in-article-2": "본문 하단 광고",
  footer: "푸터 광고",
};

/**
 * AdSense 광고 자리.
 * NEXT_PUBLIC_ADSENSE_CLIENT 와 해당 슬롯의 단위 ID가 모두 있어야 실제로 렌더한다.
 */
export default function AdSlot({ slot, className = "", showPlaceholder = false }: AdSlotProps) {
  const client = adClient();
  const slotId = adSlotId(slot);
  const ready = client.length > 0 && slotId.length > 0;

  // 미설정 + 자리까지 없애야 하는 슬롯이면 아무것도 그리지 않는다.
  if (!ready && !showPlaceholder && adCollapsesWhenMissing(slot)) return null;

  const minH = adMinHeight(slot);

  if (!ready) {
    return (
      <aside
        className={`flex ${minH} items-center justify-center rounded-lg border border-dashed border-ink-200 bg-ink-50 px-3 py-4 text-center text-xs text-ink-700/80 ${className}`}
        aria-label={LABELS[slot]}
      >
        <div>
          <p className="font-medium text-ink-700">{LABELS[slot]}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-700/60">
            {client
              ? "광고 단위 ID를 설정하면 여기에 광고가 표시됩니다."
              : "AdSense 승인 후 클라이언트 ID와 광고 단위 ID를 설정하면 광고가 표시됩니다."}
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${minH} overflow-hidden ${className}`} aria-label={LABELS[slot]}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format={adFormat(slot)}
        data-full-width-responsive="true"
      />
    </aside>
  );
}