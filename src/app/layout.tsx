import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

export const metadata: Metadata = {
  title: "WPTI-Quick Web v1.1",
  description: "Reflect on leisure activity, active travel, and sitting; choose a next step with WPTI-Quick. Responses and plans stay in the browser."
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
        <Analytics />
      </body>
    </html>
  );
}
