import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "مَعِين - منصة تعليمية متكاملة",
  description: "منصة تعليمية متكاملة تقدم دورات ودروس في مختلف المجالات مع نظام تقييم وتفاعل متقدم",
  keywords: ["معين", "تعليم", "دورات", "منصة تعليمية", "تطوير", "مهارات"],
  authors: [{ name: "فريق معين" }],
  openGraph: {
    title: "مَعِين - منصة تعليمية متكاملة",
    description: "منصة تعليمية متكاملة تقدم دورات ودروس في مختلف المجالات",
    url: "https://maaen.example.com",
    siteName: "مَعِين",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مَعِين - منصة تعليمية متكاملة",
    description: "منصة تعليمية متكاملة تقدم دورات ودروس في مختلف المجالات",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
