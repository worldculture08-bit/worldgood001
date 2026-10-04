"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * AdSense 로더.
 *
 * 스크립트만 불러오면 광고가 절대 나오지 않는다. 반드시 각
 * `ins.adsbygoogle` 마다 `(adsbygoogle = window.adsbygoogle || []).push({})`
 * 를 한 번씩 불러야 그 자리 하나당 광고 요청이 1건 나간다.
 *
 * push 를 빠뜨리면 스크립트는 정상 로드되지만 화면에 아무것도 안 뜨고,
 * 애드센스 콘솔에도 노출(impression)이 0 으로 기록된다 → 수익 0원.
 *
 * 이유: 이 컴포넌트에는 "클라이언트 ID가 있을 때만" 푸시한다.
 * 승인 전(환경변수 없음)에는 push 도 스크립트도 나가지 않는다.
 */
export default function AdSenseScript() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const pathname = usePathname();

  // 페이지 이동 후 새로 그려진 ins 마다 다시 push 한다.
  // App Router 는 클라이언트 라우팅이라 다음.js가 알아서 해주지 않는다.
  useEffect(() => {
    if (!client) return;

    const pushAll = () => {
      const slots = document.querySelectorAll<HTMLModElement>(
        "ins.adsbygoogle:not([data-pushed])",
      );
      slots.forEach((el) => {
        // 같은 자리를 두 번 push 하면 중복 요청이 되고 콘솔에 경고가 남는다.
        el.setAttribute("data-pushed", "1");
        try {
          const w = window as unknown as { adsbygoogle?: unknown[] };
          (w.adsbygoogle = w.adsbygoogle || []).push({});
        } catch {
          // 스크립트가 아직 없으면 window.adsbygoogle 배열을 만들어 두는 것까지가
          // 전부다. 실패를 삼켜도 다음 렌더에서 다시 시도한다.
        }
      });
    };

    // 스크립트 로드 직후, 그리고 이미 로드된 경우 즉시 실행.
    pushAll();
    const t = window.setTimeout(pushAll, 400);
    window.addEventListener("load", pushAll);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", pushAll);
    };
  }, [client, pathname]);

  if (!client) return null;

  return (
    <Script
      id="adsense-init"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}