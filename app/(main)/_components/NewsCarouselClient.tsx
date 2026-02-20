"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";

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

function NewsCardItem({ n, isAdmin }: { n: NewsCard; isAdmin: boolean }) {
  return (
    <Link href={`/notice/${n.id}`} className="block shrink-0 snap-start">
      <article className="card-border-shadow w-[280px] rounded-2xl transition hover:bg-black/5 sm:w-[320px] lg:w-[340px]">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-black/5">
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
            <span className="badge-category">NEWS</span>
          </div>
        </div>
        <div className="flex min-h-[120px] flex-col p-5">
          <div className="mb-2 flex items-center gap-2 text-xs opacity-70">
            <span>{formatYM(n.published_at)}</span>
            {isAdmin && n.pinned && <span>📌</span>}
            {isAdmin && isNew(n.created_at) && <span className="font-semibold">N</span>}
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
  const [index, setIndex] = useState(0);
  const [stepPx, setStepPx] = useState(344);
  const [isAdmin, setIsAdmin] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = news.length;

  useEffect(() => {
    createBrowserSupabase().auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 4000);
    return () => clearInterval(t);
  }, [total]);

  useEffect(() => {
    const el = trackRef.current?.querySelector("article");
    if (!el || total === 0) return;
    const gap = 24;
    const w = el.getBoundingClientRect().width;
    setStepPx(w + gap);
  }, [total, news]);

  if (news.length === 0) {
    return (
      <div className="py-12 pl-6 text-sm opacity-60 lg:pl-0">
        등록된 뉴스가 없습니다.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden py-3">
      <div
        ref={trackRef}
        className="flex gap-6 transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * stepPx}px)` }}
      >
        {news.map((n) => (
          <NewsCardItem key={n.id} n={n} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
