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

  const text = "FUTURE SMILE CLINIC";
  const brandRef = React.useRef<HTMLDivElement | null>(null);

  // Fit the brand text by applying a horizontal scale so the phrase fills the available header width
  React.useEffect(() => {
    if (!loadingComplete) return;
    const el = brandRef.current;
    if (!el) return;

    let timer: any = null;
    const fit = () => {
      // Try to measure the inner header available width (container minus left/right items)
      const headerInner = document.querySelector(
        "[data-header-inner]"
      ) as HTMLElement | null;
      const headerLeft = headerInner?.querySelector(
        "[data-header-left]"
      ) as HTMLElement | null;
      const headerRight = headerInner?.querySelector(
        "[data-header-right]"
      ) as HTMLElement | null;

      const headerInnerWidth = headerInner
        ? headerInner.clientWidth
        : el.parentElement
        ? el.parentElement.clientWidth
        : el.clientWidth;
      const leftW = headerLeft ? headerLeft.offsetWidth : 0;
      const rightW = headerRight ? headerRight.offsetWidth : 0;

      const availableWidth = Math.max(
        64,
        headerInnerWidth - leftW - rightW - 32
      ); // small margin buffer

      const textWidth = el.scrollWidth;
      if (!textWidth || !availableWidth) return;

      // compute scale so full phrase fills the available header inner width
      const scaleX = availableWidth / textWidth;

      // cap excessive distortion
      const cappedScaleX = Math.max(0.8, Math.min(1.25, scaleX));

      el.style.whiteSpace = "nowrap";
      el.style.transformOrigin = "center";
      el.style.transform = `scaleX(${cappedScaleX}) scaleY(1.15)`;
      // ensure element has same visual width as available area
      el.style.maxWidth = `${availableWidth}px`;
      el.style.display = "inline-block";
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
        <div className={styles.brandText} ref={brandRef}>
          {text.split("").map((char, index) => (
            <span key={index} className={styles.letter}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
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
