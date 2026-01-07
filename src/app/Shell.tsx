"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Home page uses the FullPageScroller which includes its own header/footer slides.
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <Header />}
      <main className="min-h-[calc(100vh-16rem)]">{children}</main>
      {!isHome && <Footer />}
    </>
  );
}
