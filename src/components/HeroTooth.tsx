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
  // Render only letters (exclude spaces) so we can distribute them evenly across the line
  const lettersOnly = text.replace(/\s+/g, "").split("");

  return (
    <section className={styles.hero} aria-label="Hero Section">
      {/* Background with gradient overlay */}
      <div className={styles.gradientBg} aria-hidden />

      {/* Text layer behind tooth */}
      <div className={styles.textLayer} ref={textRef} aria-hidden>
        <div className={styles.brandText}>
          {lettersOnly.map((char, index) => (
            <span key={index} className={styles.letter}>
              {char}
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
