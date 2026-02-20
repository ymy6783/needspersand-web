import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative border-t bg-neutral-50" style={{ borderTopWidth: 1, borderTopColor: "#DEDEDE" }}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logos/logo.svg"
              alt="NEEDS PERSAND"
              width={180}
              height={36}
            />
          </Link>

          <nav className="flex flex-wrap items-center gap-6 text-sm text-neutral-600">
            <Link href="#about" className="hover:text-neutral-900">
              About
            </Link>
            <Link href="#contact" className="hover:text-neutral-900">
              Contact
            </Link>
            <Link href="/notice" className="hover:text-neutral-900">
              Notice
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t pt-8" style={{ borderTopWidth: 1, borderTopColor: "#DEDEDE" }}>
          <div className="text-sm text-neutral-500">
            <p className="font-medium text-neutral-700">(주)니즈퍼샌드</p>
            <p className="mt-1">
              서울시 강남구 테헤란로 151 (역삼동, 역삼하이츠빌딩) 5층 512호
            </p>
            <a
              href="mailto:info@needspersand.co.kr"
              className="mt-1 block hover:text-neutral-900"
            >
              info@needspersand.co.kr
            </a>
            <p className="mt-2">
              © {new Date().getFullYear()} Needspersand. 모든 권리 보유
            </p>
          </div>
        </div>
      </div>

      {/* 우측 하단 로그인 아이콘 */}
      <Link
        href="/admin/login"
        className="absolute bottom-4 right-6 flex h-9 w-9 items-center justify-center rounded-full text-neutral-400 opacity-80 transition-colors hover:opacity-100 hover:bg-neutral-200 hover:text-neutral-600"
        aria-label="관리자 로그인"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#DEDEDE"
          strokeWidth={0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 grayscale"
        >
          <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
          <path d="m21 2-9.6 9.6" />
          <circle cx="7.5" cy="15.5" r="5.5" />
        </svg>
      </Link>
    </footer>
  );
}
