"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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

const CARD_GAP = 24; // gap-6

function NewsCardItem({ n, isAdmin }: { n: NewsCard; isAdmin: boolean }) {
  return (
    <Link href={`/notice/${n.id}`} className="block shrink-0">
      <article
        data-carousel-card
        className="card-border-shadow min-w-[280px] max-w-[280px] rounded-2xl transition hover:bg-black/5 sm:min-w-[320px] sm:max-w-[320px] lg:min-w-[340px] lg:max-w-[340px]"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-black/5">
          {n.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={n.image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200">
              <Image
                src="/images/logos/logo.svg"
                alt="NEEDS PERSAND"
                width={140}
                height={25}
                className="brightness-0 invert opacity-60"
              />
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

const DRAG_THRESHOLD = 40;

export default function NewsCarouselClient({ news }: { news: NewsCard[] }) {
  const [index, setIndex] = useState(0);
  const [stepPx, setStepPx] = useState(280 + CARD_GAP);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const captureTargetRef = useRef<HTMLElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const justDraggedRef = useRef(false);
  const total = news.length;

  const measureStep = useCallback(() => {
    const el = trackRef.current?.querySelector("[data-carousel-card]");
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    if (w > 0) setStepPx(Math.round(w) + CARD_GAP);
  }, []);

  const goToIndex = useCallback(
    (i: number) => {
      setIndex(Math.max(0, Math.min(i, total - 1)));
    },
    [total]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    isDraggingRef.current = true;
    justDraggedRef.current = false;
    captureTargetRef.current = e.target as HTMLElement;
    pointerIdRef.current = e.pointerId;
    captureTargetRef.current.setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current || total <= 1) return;
      const delta = e.clientX - startXRef.current;
      const maxDrag = stepPx * 0.5;
      setDragOffset(Math.max(-maxDrag, Math.min(maxDrag, delta)));
    },
    [total, stepPx]
  );

  const handlePointerUp = useCallback(
    (e?: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const pid = e?.pointerId ?? pointerIdRef.current;
      if (captureTargetRef.current && pid != null) {
        captureTargetRef.current.releasePointerCapture?.(pid);
      }
      captureTargetRef.current = null;
      pointerIdRef.current = null;
      const offset = dragOffset;
      setDragOffset(0);

      if (offset < -DRAG_THRESHOLD) {
        goToIndex(index + 1);
        justDraggedRef.current = true;
      } else if (offset > DRAG_THRESHOLD) {
        goToIndex(index - 1);
        justDraggedRef.current = true;
      }
    },
    [dragOffset, index, goToIndex]
  );

  const handlePointerCancel = useCallback(() => {
    isDraggingRef.current = false;
    setDragOffset(0);
  }, []);

  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (justDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      justDraggedRef.current = false;
    }
  }, []);

  useEffect(() => {
    createBrowserSupabase().auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
  }, []);

  useEffect(() => {
    measureStep();
    const ro = new ResizeObserver(measureStep);
    const el = trackRef.current;
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [measureStep, total]);

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 4000);
    return () => clearInterval(t);
  }, [total]);

  if (news.length === 0) {
    return (
      <div className="py-12 pl-6 text-sm opacity-60 lg:pl-0">
        등록된 뉴스가 없습니다.
      </div>
    );
  }

  const transformX = -(index * stepPx) + dragOffset;

  return (
    <div
      className="relative w-full cursor-grab overflow-hidden py-3 active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => handlePointerUp(e)}
      onPointerLeave={() => handlePointerUp()}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
    >
      <div
        ref={trackRef}
        className="flex gap-6 transition-transform duration-150 ease-out"
        style={{ transform: `translateX(${transformX}px)` }}
      >
        {news.map((n) => (
          <NewsCardItem key={n.id} n={n} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
