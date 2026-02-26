import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Needspersand",
  description: "Building real-world services powered by practical blockchain infrastructure.",
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