"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./HeroTooth.module.css";

interface HeroToothProps {
  loadingComplete?: boolean;
}

export default function HeroTooth({
  loadingComplete = false,
}: HeroToothProps): JSX.Element {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadingComplete) return;

    const textEl = textRef.current;
    if (!textEl) return;

    const letters = textEl.querySelectorAll<HTMLSpanElement>(
      `.${styles.letter}`
    );

    // Small delay before starting animation
    setTimeout(() => {
      letters.forEach((letter, index) => {
        setTimeout(() => {
          letter.style.opacity = "1";
          letter.style.transform = "translateY(0)";
        }, index * 50); // 50ms delay between each letter
      });
    }, 300); // Wait 300ms after loading completes
  }, [loadingComplete]);

  const fullText = "FUTURE SMILE CLINIC";
  const compactText = "FUTURE SMILE";
  const brandRef = React.useRef<HTMLDivElement | null>(null);
  const fullInnerRef = React.useRef<HTMLSpanElement | null>(null);
  const compactInnerRef = React.useRef<HTMLSpanElement | null>(null);

  // Fit the brand text by applying a horizontal scale so the phrase fills the available header width
  React.useEffect(() => {
    if (!loadingComplete) return;
    const el = brandRef.current;
    const fullInner = fullInnerRef.current;
    const compactInner = compactInnerRef.current;
    if (!el || !fullInner || !compactInner) return;

    let timer: any = null;
    const fit = () => {
      // Make the phrase fill the full width of the letters div itself.
      // The parent container handles header alignment; this element should just fill 100%.
      const containerWidth = el.clientWidth;
      const useCompact = window.innerWidth <= 520;
      const activeInner = useCompact ? compactInner : fullInner;
      const inactiveInner = useCompact ? fullInner : compactInner;

      // Reset inactive variant so it doesn't affect layout/measurement
      inactiveInner.style.transform = "";

      // Measure actual text width using the shrink-to-fit inner wrapper
      const textWidth = activeInner.scrollWidth;
      if (!textWidth || !containerWidth) return;

      const scaleX = containerWidth / textWidth;

      // Make letters a bit taller without changing their font-size.
      const scaleY = 1.28;

      activeInner.style.whiteSpace = "nowrap";
      activeInner.style.transformOrigin = "center";
      activeInner.style.transform = `scaleX(${scaleX}) scaleY(${scaleY})`;
    };

    fit();
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(fit, 80);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [loadingComplete]);

  return (
    <section className={styles.hero} aria-label="Hero Section">
      {/* Background with gradient overlay */}
      <div className={styles.gradientBg} aria-hidden />

      {/* Text layer behind tooth */}
      <div className={styles.textLayer} ref={textRef} aria-hidden>
        <div className={styles.brandContainer}>
          <div className={styles.brandText} ref={brandRef}>
            <span className={`${styles.brandInner} ${styles.fullOnly}`} ref={fullInnerRef}>
              {fullText.split("").map((char, index) => (
                <span key={`f-${index}`} className={styles.letter}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <span
              className={`${styles.brandInner} ${styles.compactOnly}`}
              ref={compactInnerRef}
            >
              {compactText.split("").map((char, index) => (
                <span key={`c-${index}`} className={styles.letter}>
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Hero image with tooth */}
      <div className={`${styles.layer} ${styles.heroImage}`} aria-hidden>
        <picture>
          <source type="image/png" srcSet="/images/hero.png" />
          <img
            src="/images/hero.png"
            alt="Future Smile Clinic"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </picture>
      </div>

      {/* Layer 4 — Foreground: nav + front text (z-index:4) */}
      {/* Booking button: centered under hero on small screens, fixed bottom-right on large screens */}
      <div className={styles.ctaWrapper}>
        <Link href="/appointments" className={styles.ctaButton}>
          <span>حجز موعد</span>
          <div className={styles.ctaIcon}>
            <svg
              className="w-3 h-3 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </Link>
      </div>
    </section>
  );
}
