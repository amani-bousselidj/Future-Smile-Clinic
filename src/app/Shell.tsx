"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import FooterSection from "@/components/FooterSection";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Home page uses the FullPageScroller which includes its own header/footer slides.
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isHome && <FooterSection />}
    </>
  );
}
