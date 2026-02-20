"use client";

import { useCallback, useRef, useState } from "react";

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

// 곡선 트랙 상의 점 좌표 (0~1, 0=맨위 1=맨아래)
function getArcPoint(t: number, width: number, height: number) {
  const angle = Math.PI * 0.7 - t * Math.PI * 0.6; // 왼쪽 세그먼트
  const r = Math.min(width, height) * 1.1;
  const cx = width * 0.55;
  const cy = height * 0.5;
  const x = cx - Math.cos(angle) * r * 0.45;
  const y = cy - Math.sin(angle) * r * 0.45;
  const rot = (angle - Math.PI / 2) * (180 / Math.PI);
  return { x, y, rot };
}

export default function SectionTimeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startIndex = useRef(3);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startIndex.current = activeIndex;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [activeIndex]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dy = startY.current - e.clientY;
      const threshold = 50;
      let newIndex = startIndex.current;
      if (dy > threshold) {
        newIndex = Math.max(0, startIndex.current - 1);
      } else if (dy < -threshold) {
        newIndex = Math.min(3, startIndex.current + 1);
      }
      setActiveIndex(newIndex);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  const handleYearClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const activeGroup = TIMELINE_DATA[activeIndex] ?? TIMELINE_DATA[3];
  const trackW = 160;
  const trackH = 320;

  return (
    <section id="timeline" className="w-full bg-[#f5f2ed] py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-[10%] sm:px-[8%] md:flex-row md:items-center md:gap-16 md:px-8 lg:px-6">
        {/* LEFT: 타이틀 */}
        <div className="shrink-0 md:w-[200px]">
          <h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            Milestones <span className="text-orange-500">&amp;</span>
            <br />
            Timeline
          </h2>
        </div>

        {/* CENTER + RIGHT: 곡선 트랙 + 연도 + 콘텐츠 */}
        <div className="flex flex-1 flex-col gap-8 md:flex-row md:items-stretch md:gap-12">
          {/* 곡선 트랙 + 연도 (이미지처럼 왼쪽 곡선) */}
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`relative h-[320px] w-full shrink-0 md:w-[200px] ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {/* 곡선 트랙 SVG */}
            <svg
              viewBox={`0 0 ${trackW} ${trackH}`}
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <path
                d={`M ${trackW * 0.25} ${trackH * 0.08} Q ${trackW * 0.9} ${trackH * 0.15} ${trackW * 0.7} ${trackH * 0.5} Q ${trackW * 0.5} ${trackH * 0.85} ${trackW * 0.35} ${trackH * 0.92}`}
                fill="none"
                stroke="#d4d4d4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* 연도 숫자 - 곡선 따라 배치 */}
            {TIMELINE_DATA.map((group, i) => {
              const t = i / (TIMELINE_DATA.length - 1);
              const { x, y, rot } = getArcPoint(t, trackW, trackH);
              const isActive = i === activeIndex;
              return (
                <button
                  key={group.year}
                  type="button"
                  onClick={() => handleYearClick(i)}
                  className="absolute left-0 top-0 flex items-center justify-end gap-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
                  style={{
                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg)`,
                  }}
                  aria-pressed={isActive}
                  aria-label={`${group.year}년`}
                >
                  {isActive && (
                    <span
                      className="absolute right-full top-1/2 mr-2 h-1.5 w-1.5 -translate-y-1/2 shrink-0 rounded-full bg-neutral-800"
                      aria-hidden
                    />
                  )}
                  <span
                    className="inline-block tabular-nums transition-all duration-200"
                    style={{
                      transform: `rotate(${-rot}deg)`,
                      fontSize: isActive ? "1.75rem" : "1rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#262626" : "#a3a3a3",
                    }}
                  >
                    {group.year.slice(2)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 우측: 선택된 연도의 이벤트만 (이미지처럼 제목+설명) */}
          <div className="min-h-[200px] flex-1 pl-0 md:min-h-[320px] md:pl-4">
            <div className="space-y-6">
              {activeGroup.events.map((evt, i) => (
                <div key={`${activeGroup.year}-${evt.quarter}-${i}`}>
                  <p className="text-lg font-semibold text-neutral-900 md:text-xl">
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
                  <p className="mt-1 text-sm text-neutral-500 md:text-base">
                    {evt.quarter}
                    {evt.bullets && evt.bullets.length > 0 && (
                      <> · {evt.bullets.join(", ")}</>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
