"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import styles from "./HeroTooth.module.css";

export default function HeroTooth(): JSX.Element {
  const rootRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const toothRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  // parallax removed; rafRef not needed

  useEffect(() => {
    // Parallax disabled: keep background and tooth static for consistent layout

    // IntersectionObserver for reveal animations
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.classList.add("inView");
          else el.classList.remove("inView");
        });
      },
      { threshold: 0.2 }
    );

    if (textRef.current) {
      textRef.current.classList.add("offset");
      io.observe(textRef.current);
    }

    return () => {
      // No scroll listener (parallax disabled). Clean up observer only.
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    // JS-based positioning: ensure the bottom of the tooth is always 20px
    // above the bottom of the decorative circle (data-hero-circle).
    // Do not capture refs here; re-read inside updateToothPosition to
    // satisfy TypeScript that elements may be null at runtime.

    let ro: ResizeObserver | null = null;

    function updateToothPosition() {
      const toothEl = toothRef.current;
      const rootEl = rootRef.current;
      const bgEl = bgRef.current;
      if (!toothEl || !rootEl || !bgEl) return;
      try {
        const rootRect = rootEl.getBoundingClientRect();
        const bgRect = bgEl.getBoundingClientRect();

        // Desired gap in pixels between bottom of tooth and bottom of background
        const gap = 100;

        // distance from root bottom to background bottom
        const distanceFromRootBottomToBgBottom =
          rootRect.bottom - bgRect.bottom;

        // allow negative values so the tooth can be positioned above the root
        const clamped = Math.round(distanceFromRootBottomToBgBottom + gap);

        toothEl.style.position = "absolute";
        // Clear any CSS vertical offsets so JS is the single source of truth
        toothEl.style.top = "auto";
        toothEl.style.bottom = "auto";
        // Center horizontally by default; JS controls vertical position
        toothEl.style.left = "50%";
        toothEl.style.transform = "translate(-50%, 0)";
        toothEl.style.bottom = `${clamped}px`;
      } catch (e) {
        // silent fail
      }
    }

    // Initial positioning
    updateToothPosition();

    // Observe resizes on the background element and the root container
    try {
      ro = new ResizeObserver(() => updateToothPosition());
      const currentBg = bgRef.current;
      if (currentBg) ro.observe(currentBg);
      const currentRoot = rootRef.current;
      if (currentRoot) ro.observe(currentRoot);
    } catch (e) {
      // ResizeObserver might not be available in some envs; fall back to window resize
      window.addEventListener("resize", updateToothPosition);
    }

    // Also listen for window resize to be safe
    window.addEventListener("resize", updateToothPosition);

    return () => {
      if (ro) {
        try {
          ro.disconnect();
        } catch (e) {}
      }
      window.removeEventListener("resize", updateToothPosition);
    };
  }, []);

  return (
    <section className={styles.hero} ref={rootRef} aria-label="Hero Section">
      {/* Layer 1 — Background (z-index:1) */}
      <div className={`${styles.layer} ${styles.bg}`} ref={bgRef} aria-hidden>
        <picture>
          <source type="image/png" srcSet="/images/background.png" />
          <img
            src="/images/background.png"
            alt="Clinic background"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </picture>
      </div>

      {/* Layer 2 — Text behind tooth (z-index:2) */}
      <div className={`${styles.layer} ${styles.textBehind}`} aria-hidden>
        <div ref={textRef} className={styles.bigText}>
          КОМФОРТНА СТОМАТОЛО
        </div>
      </div>

      {/* Layer 3 — Tooth image (z-index:3) */}
      <div className={`${styles.layer} ${styles.tooth}`} ref={toothRef}>
        <picture>
          <source type="image/png" srcSet="/images/tooth.png" />
          <img
            src="/images/tooth.png"
            alt="tooth"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      {/* Layer 4 — Foreground: nav + front text (z-index:4) */}
      {/* Booking button: centered under hero on small screens, fixed bottom-right on large screens */}
      <div className={styles.ctaWrapper}>
        <div className="absolute left-1/2 bottom-6 transform -translate-x-1/2 lg:fixed lg:bottom-10 lg:right-10 lg:left-auto lg:translate-x-0">
          <Link href="/appointments">
            <Button
              size="lg"
              className={`${styles.heroButton} group relative bg-white text-transparent font-bold overflow-hidden`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-l from-blue-600 via-green-500 to-blue-600">
                احجز موعد
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-gradient-to-l group-hover:from-blue-600 group-hover:via-green-500 group-hover:to-blue-600 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center group-hover:text-white pointer-events-none"></div>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
