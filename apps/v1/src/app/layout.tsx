import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ClientLayout from "./ClientLayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valentin Roehle",
  description:
    "This repository showcases a curated selection of my software development projects. It includes applications, tools, and experiments that demonstrate my proficiency in various technologies, frameworks, and problem-solving approaches.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
