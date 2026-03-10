"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TimelineEvent = {
  quarter: string;
  title: string;
  bullets?: string[];
  link?: string;
};

type YearGroup = {
  year: string;
  events: TimelineEvent[];
};

const TIMELINE_DATA: YearGroup[] = [
  {
    year: "2023",
    events: [
      {
        quarter: "Q4",
        title: "토마톡 서비스 기획 및 개발 착수",
        bullets: ["메신저 기반 서비스 구조 설계 시작"],
      },
    ],
  },
  {
    year: "2024",
    events: [
      {
        quarter: "Q2",
        title: "핵심 인프라 구축 및 아키텍처 설계 완료",
        bullets: [
          "프론트엔드 및 블록체인 지갑 인프라 구축",
          "서비스 핵심 아키텍처 설계 완료",
        ],
      },
      {
        quarter: "Q3",
        title: "시스템 1차 검증 및 배포 환경 준비",
        bullets: [
          "백엔드 및 관리자 시스템 1차 검수 완료",
          "운영 환경 배포 준비",
        ],
      },
      {
        quarter: "Q4",
        title: "Tomatok 1.0 공개",
        bullets: ["TOTT Token LBank 거래소 상장"],
        link: "#",
      },
    ],
  },
  {
    year: "2025",
    events: [
      {
        quarter: "Q1",
        title: "한국모바일게임협회와 업무협약(MOU) 체결",
        bullets: ["게임 및 블록체인 분야 협력 추진"],
        link: "#",
      },
      {
        quarter: "Q1",
        title: "펑크비즘과 업무협약(MOU) 체결",
        bullets: ["NFT 및 플랫폼 사업 협력"],
        link: "#",
      },
      {
        quarter: "Q3",
        title: "한국캐릭터협회와 업무협약(MOU) 체결",
        bullets: ["캐릭터 및 콘텐츠 사업 협력"],
        link: "#",
      },
      {
        quarter: "Q4",
        title: "Tomatok 2.0 개발 완료",
        bullets: ["GTTF 2025 공식 메신저 선정"],
        link: "#",
      },
    ],
  },
  {
    year: "2026",
    events: [
      {
        quarter: "Q1",
        title: "NFT 520개 발행",
        link: "#",
      },
      {
        quarter: "Q1",
        title: "TOTT Token 3억 개 소각",
        link: "#",
      },
    ],
  },
];

export default function SectionTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    scrollTop.current = scrollRef.current?.scrollTop ?? 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !scrollRef.current) return;
      const dy = startY.current - e.clientY;
      scrollRef.current.scrollTop = scrollTop.current + dy;
      startY.current = e.clientY;
      scrollTop.current = scrollRef.current.scrollTop;
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };
    scrollToBottom();
    requestAnimationFrame(scrollToBottom);
  }, []);

  return (
    <section id="timeline" className="scroll-mt-24 w-full bg-[#f5f2ed] py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-[10%] sm:px-[8%] md:flex-row md:items-stretch md:gap-12 md:px-8 lg:px-6">
        {/* LEFT: 타이틀 */}
        <div className="shrink-0 md:w-1/3">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            Milestones <span className="text-orange-500">&amp;</span>
            <br />
            Timeline
          </h2>
          {/* 세로 스크롤 안내 (반투명, 타이틀 아래) */}
          <p
            className="mt-4 flex items-center gap-2 text-sm text-neutral-500 opacity-50"
            style={{ pointerEvents: "none" }}
            aria-hidden
          >
            <span className="inline-flex flex-col animate-scroll-hint">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <span>위아래로 움직이세요</span>
          </p>
        </div>

        {/* RIGHT: 세로 스크롤 타임라인 */}
        <div className="relative flex-1">
          <div
            ref={scrollRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`timeline-scroll relative h-[420px] overflow-y-auto overflow-x-hidden rounded-3xl py-14 scrollbar-hide ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <div className="relative flex gap-8 px-2">
              {/* 세로선 */}
              <div
                className="absolute left-[120px] top-0 bottom-0 w-px bg-neutral-400 md:left-[124px]"
                aria-hidden
              />

              <div className="flex w-full flex-col">
                {TIMELINE_DATA.map((group) => (
                  <div
                    key={group.year}
                    className="flex items-start gap-10 py-10 first:pt-2 last:pb-2"
                  >
                    <div className="flex w-[60px] shrink-0 items-start pt-0.5">
                      <span className="text-[1.2rem] font-bold text-neutral-900 md:text-3xl">
                        {group.year}
                      </span>
                    </div>

                    <div className="relative flex-1 min-w-0 pl-10">
                      <div className="space-y-6">
                        {group.events.map((evt, i) => (
                          <div
                            key={`${group.year}-${evt.quarter}-${i}`}
                            className="relative flex pl-6"
                          >
                            <div
                              className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-[33px] shrink-0 rounded-full bg-neutral-700 md:-translate-x-[29px]"
                              aria-hidden
                            />
                            <div>
                              <span className="text-xs font-medium text-neutral-500">
                                {evt.quarter}
                              </span>
                              <p className="mt-1 text-sm font-medium text-neutral-900 md:text-base">
                                {evt.title}
                                {evt.link && (
                                  <a
                                    href={evt.link}
                                    className="ml-1 inline-flex text-neutral-500 hover:text-orange-500"
                                    aria-label="링크"
                                  >
                                    ↗
                                  </a>
                                )}
                              </p>
                              {evt.bullets && evt.bullets.length > 0 && (
                                <ul className="mt-2 space-y-1 text-xs text-neutral-600 md:text-sm">
                                  {evt.bullets.map((b, j) => (
                                    <li key={j} className="flex gap-2">
                                      <span className="text-neutral-400">-</span>
                                      {b}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
