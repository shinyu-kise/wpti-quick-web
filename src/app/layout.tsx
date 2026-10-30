import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "WPTI-Quick | 運動と座る時間を3問で振り返る",
  icons: { icon: "/favicon.svg" },
  description: "Answer three questions about movement and sitting. Review your responses and optionally write a note. Inputs are not sent or saved automatically."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
