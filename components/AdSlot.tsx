type AdSlotProps = {
  /** sidebar | in-article | banner */
  slot: "sidebar" | "in-article" | "banner";
  className?: string;
};

/**
 * AdSense-ready placeholder.
 * NEXT_PUBLIC_ADSENSE_CLIENT가 설정되면 스크립트/슬롯 영역을 준비합니다.
 * 없으면 레이아웃 유지용 안내 박스를 보여 줍니다.
 */
export default function AdSlot({ slot, className = "" }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const slotId = {
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR?.trim(),
    "in-article": process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE?.trim(),
    banner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER?.trim(),
  }[slot];
  const labels: Record<AdSlotProps["slot"], string> = {
    sidebar: "사이드바 광고 영역",
    "in-article": "본문 중간 광고 영역",
    banner: "배너 광고 영역",
  };

  const minH =
    slot === "sidebar" ? "min-h-[250px]" : slot === "banner" ? "min-h-[90px]" : "min-h-[120px]";

  if (!client || !slotId) {
    const message = client
      ? "AdSense 광고 단위 ID를 설정하면 여기에 광고가 표시됩니다."
      : "AdSense 승인 후 클라이언트 ID와 광고 단위 ID를 설정하면 광고가 표시됩니다.";
    return (
      <aside
        className={`flex ${minH} items-center justify-center rounded-lg border border-dashed border-ink-200 bg-ink-50 px-3 py-4 text-center text-xs text-ink-700/80 ${className}`}
        aria-label={labels[slot]}
      >
        <div>
          <p className="font-medium text-ink-700">{labels[slot]}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-700/60">
            {message}
          </p>
        </div>
      </aside>
    );
  }

  // 실제 광고 단위 ID는 AdSense 콘솔에서 발급 후 data-ad-slot에 넣으세요.
  return (
    <aside
      className={`${minH} overflow-hidden rounded-lg ${className}`}
      aria-label={labels[slot]}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format={slot === "sidebar" ? "vertical" : "auto"}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
