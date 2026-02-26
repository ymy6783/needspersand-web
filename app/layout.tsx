import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "니즈퍼샌드 | 블록체인 기반 서비스 개발·운영 기업",
  description:
    "니즈퍼샌드는 블록체인 기술을 기반으로 토마톡, TOTT 토큰, 스테이킹 기능 등 다양한 서비스를 개발·운영하는 기업입니다.",
  metadataBase: new URL("https://needspersand.co.kr"),
  openGraph: {
    title: "니즈퍼샌드 | 블록체인 기반 서비스 개발·운영 기업",
    description:
      "토마톡 메신저와 TOTT 토큰 생태계를 운영하는 블록체인 기반 서비스 기업, 니즈퍼샌드 공식 홈페이지입니다.",
    url: "/",
    siteName: "니즈퍼샌드",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "니즈퍼샌드 공식 홈페이지",
      },
    ],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "니즈퍼샌드 | 블록체인 기반 서비스 개발·운영 기업",
    description:
      "토마톡, TOTT 토큰, 스테이킹 기능을 개발·운영하는 블록체인 기반 서비스 기업.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}