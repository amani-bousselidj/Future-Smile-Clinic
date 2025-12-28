import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "@/styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Future Smile Clinic - Professional Dental Care",
    template: "%s | Future Smile Clinic",
  },
  description:
    "Professional dental clinic providing comprehensive oral care services.",
  keywords: [
    "dental clinic",
    "dentist",
    "oral health",
    "dental services",
    "teeth whitening",
    "orthodontics",
  ],
  authors: [{ name: "Future Smile Clinic" }],
  creator: "Future Smile Clinic",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://future-smile-clinic.vercel.app",
    siteName: "Future Smile Clinic",
    title: "Future Smile Clinic - Professional Dental Care",
    description:
      "Professional dental clinic providing comprehensive oral care services.",
    images: [
      {
        url: "https://future-smile-clinic.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Future Smile Clinic",
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
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0066cc" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-16rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
