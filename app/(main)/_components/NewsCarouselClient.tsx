"use client";

import Link from "next/link";

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

function isNew(createdAt?: string) {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  const diffHours = (Date.now() - created) / (1000 * 60 * 60);
  return diffHours <= 72;
}

function NewsCardItem({ n }: { n: NewsCard }) {
  return (
    <Link href={`/notice/${n.id}`} className="shrink-0 snap-start">
      <article className="w-[340px] overflow-hidden rounded-2xl border shadow-sm hover:bg-black/5 sm:w-[360px]">
        <div className="relative aspect-[16/9] w-full bg-black/5">
          {n.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={n.image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs opacity-60">
              이미지 없음
            </div>
          )}
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-neutral-800 px-2 py-1 text-[10px] font-medium text-white">
              NEWS
            </span>
          </div>
        </div>
        <div className="flex min-h-[120px] flex-col p-5">
          <div className="mb-2 flex items-center gap-2 text-xs opacity-70">
            <span>{formatYM(n.published_at)}</span>
            {n.pinned && <span>📌</span>}
            {isNew(n.created_at) && <span className="font-semibold">N</span>}
          </div>
          <div className="line-clamp-1 text-base font-semibold">{n.title}</div>
          <div className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm opacity-70">
            {n.content}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function NewsCarouselClient({ news }: { news: NewsCard[] }) {
  if (news.length === 0) {
    return <div className="text-sm opacity-60">등록된 뉴스가 없습니다.</div>;
  }

  // 무한 루프용 복제 (양쪽 방향 seamless)
  const duplicated = [...news, ...news];

  return (
    <div className="relative overflow-hidden">
      <div className="flex w-max gap-6 animate-news-marquee">
        {duplicated.map((n, idx) => (
          <NewsCardItem key={`${n.id}-${idx}`} n={n} />
        ))}
      </div>
    </div>
  );
}
