import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment Mapper",
  description: "AI assessment extraction and answer mapping"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}