import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "آکادمی آرایشگری مردانه | آموزش صفر تا صد اصلاح مو و ریش",
  description:
    "آموزش جامع، مو به مو و مرحله‌به‌مرحله آرایشگری مردانه به زبان فارسی؛ از تکنیک‌های فید، کوتاهی‌های کلاسیک، سبک‌های مدرن و سنتی تا ریش و راه‌اندازی کار.",
  keywords: [
    "آرایشگری مردانه",
    "آموزش فید",
    "لو فید",
    "های فید",
    "اسکین فید",
    "کوتاهی مو مردانه",
    "آرایشگر",
    "ریش",
    "آموزش اصلاح مو",
  ],
  authors: [{ name: "آکادمی آرایشگری مردانه" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "آکادمی آرایشگری مردانه — از صفر تا استادی",
    description:
      "کامل‌ترین آموزش فارسی فید، کوتاهی‌های کلاسیک، مدرن و سنتی؛ مو به مو و مرحله به مرحله.",
    siteName: "آکادمی آرایشگری مردانه",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
