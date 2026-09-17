import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "문의",
  description: "하루기록에 관한 문의와 정정 요청을 보내는 방법입니다.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-medium text-accent">Contact</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink-900">
        문의하기
      </h1>
      <div className="prose-ko mt-8">
        <p>
          글의 사실관계 정정, 개인정보 삭제 요청, 서비스 이용 문의는 아래
          GitHub 저장소의 Issues에서 남겨 주세요.
        </p>
        <p>
          <a href={`${siteConfig.repositoryUrl}/issues`} target="_blank" rel="noreferrer">
            {siteConfig.repositoryUrl}/issues
          </a>
        </p>
        <p>
          공개 이슈에 개인정보나 비밀번호를 적지 말고, 필요한 경우 요청 내용을
          일반화해서 남겨 주세요. 확인이 필요한 글은 근거와 함께 알려 주시면
          검토 후 수정 이력을 남기겠습니다.
        </p>
      </div>
    </article>
  );
}
