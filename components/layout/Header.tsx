"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Vision & Strategy", href: "#vision" },
  { label: "What We Operate", href: "#operate" },
  { label: "News & Press", href: "#news" },
  { label: "Partners", href: "#partners" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // 1120px 이상으로 커지면 모바일 메뉴 자동 닫기
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1120) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 모바일 메뉴 열렸을 때 스크롤 잠금(선택이지만 UX 좋아짐)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logos/logo.svg"
            alt="NEEDS PERSAND"
            width={220}
            height={44}
            priority
          />
        </Link>

        {/* Desktop nav: 1120px 이상에서만 보이기 */}
        <nav className="hidden items-center gap-14 text-[15px] text-neutral-800 min-[1120px]:flex">
          {NAV.map((item) => (
            <a key={item.label} href={item.href} className="hover:opacity-70">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger: 1120px 미만에서만 보이기 */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 min-[1120px]:hidden"
        >
          <span className="sr-only">Open menu</span>
          <div className="grid gap-1">
            <span className="block h-[2px] w-5 bg-neutral-900" />
            <span className="block h-[2px] w-5 bg-neutral-900" />
            <span className="block h-[2px] w-5 bg-neutral-900" />
          </div>
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="min-[1120px]:hidden">
          {/* Overlay */}
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 z-50 h-dvh w-[86%] max-w-[360px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-900">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4 text-[16px] text-neutral-900">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 hover:bg-black/5"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
