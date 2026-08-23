import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hello-word-7",
  description: "End-to-end proof page",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
