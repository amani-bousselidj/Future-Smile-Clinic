import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "@/styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "عيادة ابتسامة المستقبل - الرعاية السنية المتخصصة",
    template: "%s | عيادة ابتسامة المستقبل",
  },
  description:
    "عيادة أسنان متخصصة توفر خدمات شاملة للعناية بالفم والأسنان بأعلى جودة واحترافية.",
  keywords: [
    "عيادة أسنان",
    "طبيب أسنان",
    "صحة الفم",
    "خدمات أسنان",
    "تبييض الأسنان",
    "تقويم الأسنان",
  ],
  authors: [{ name: "عيادة ابتسامة المستقبل" }],
  creator: "عيادة ابتسامة المستقبل",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://future-smile-clinic.vercel.app",
    siteName: "عيادة ابتسامة المستقبل",
    title: "عيادة ابتسامة المستقبل - الرعاية السنية المتخصصة",
    description:
      "عيادة أسنان متخصصة توفر خدمات شاملة للعناية بالفم والأسنان.",
    images: [
      {
        url: "https://future-smile-clinic.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "عيادة ابتسامة المستقبل",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0066cc" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 text-gray-900" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-16rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
