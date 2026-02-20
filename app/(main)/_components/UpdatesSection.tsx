import Link from "next/link";
import { fetchNewsCards, fetchNoticeHighlightOne } from "@/lib/posts";
import NewsCarouselClient from "./NewsCarouselClient";

export const dynamic = "force-dynamic";

type NewsCard = {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  published_at?: string;
  pinned?: boolean;
  created_at?: string;
};
function formatYM(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}.${m}`;
}

function formatDateKR(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("ko-KR");
}

export default async function UpdatesSection() {
  const [notice, news] = await Promise.all([
    fetchNoticeHighlightOne(),
    fetchNewsCards(10),
  ]);

  return (
    <section className="relative w-full overflow-hidden py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-[10%] sm:px-[8%] md:px-8 md:flex-row md:items-end md:gap-8 lg:px-6">
        {/* LEFT: 타이틀 + 전체보기 + 공지 (다른 섹션과 동일 컨테이너) */}
        <div className="relative flex min-w-[280px] max-w-[380px] flex-col justify-end pb-3 md:shrink-0">
            <h2 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
              Updates <span className="text-orange-500">&amp;</span>
              <br />
              Disclosures
            </h2>

            <Link href="/notice" className="mt-4 inline-block text-sm opacity-70 hover:opacity-100">
              전체보기
            </Link>

            {/* 공지 카드: 레퍼런스처럼 왼쪽 하단에 작은 카드 1개 */}
            <div className="mt-16 lg:mt-24">
              {notice ? (
                <Link
                  href={`/notice/${notice.id}`}
                  className="card-border-shadow block max-w-[280px] rounded-2xl px-4 py-4 hover:bg-black/5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="badge-category">NOTICE</span>
                    <span className="text-xs opacity-60">{formatDateKR(notice.published_at)}</span>
                  </div>

                  <div className="line-clamp-1 text-sm font-semibold">
                    {(notice.title?.length ?? 0) > 20
                      ? `${(notice.title ?? "").slice(0, 20)}...`
                      : notice.title ?? ""}
                  </div>
                </Link>
              ) : (
                <div className="card-border-shadow max-w-[280px] rounded-2xl p-4 text-sm opacity-60">
                  등록된 공지사항이 없습니다.
                </div>
              )}
            </div>
          </div>

        {/* RIGHT: 뉴스 슬라이드만 우측 끝까지 확장 (나머지는 max-w-6xl에 맞춤) */}
        <div
          className="relative flex min-w-0 flex-1 flex-col justify-end overflow-hidden pb-3"
          style={{ marginRight: "min(0px, calc((100vw - 1152px) / -2 - 24px))" }}
        >
          <NewsCarouselClient news={news} />
        </div>
      </div>
    </section>
  );
}
