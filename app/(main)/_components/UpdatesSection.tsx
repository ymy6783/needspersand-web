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
    <section className="w-full py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          {/* LEFT: 타이틀 + 전체보기 + 공지 1개(하단) */}
          <div className="relative lg:col-span-4">
            <h2 className="text-2xl font-semibold leading-tight md:text-3xl lg:text-4xl">
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
                  className="block max-w-[280px] rounded-2xl border px-4 py-4 hover:bg-black/5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium text-white">
                      NOTICE
                    </span>
                    <span className="text-xs opacity-60">{formatDateKR(notice.published_at)}</span>
                  </div>

                  <div className="line-clamp-1 text-sm font-semibold">
                    {(notice.title?.length ?? 0) > 20
                      ? `${(notice.title ?? "").slice(0, 20)}...`
                      : notice.title ?? ""}
                  </div>
                </Link>
              ) : (
                <div className="max-w-[280px] rounded-2xl border p-4 text-sm opacity-60">
                  등록된 공지사항이 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: 뉴스 카드 자동 슬라이드 (한 칸씩, 스크롤바 없음) */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden">
              <NewsCarouselClient news={news} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
