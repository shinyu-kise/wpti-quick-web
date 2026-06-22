import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "WPTI-Quick Web v1.0",
  description: "A local-only browser implementation of WPTI-Quick."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
