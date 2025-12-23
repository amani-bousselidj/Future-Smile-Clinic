import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ConditionalLayout from "../components/layout/ConditionalLayout";
import { AuthProvider } from "../contexts/AuthContext";
import ToastProvider from "../components/ToastProvider";
import { defaultMetadata } from "../lib/metadata";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
} from "../lib/structured-data";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="bg-gray-50">
        <AuthProvider>
          <ToastProvider />
          <ConditionalLayout>{children}</ConditionalLayout>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
