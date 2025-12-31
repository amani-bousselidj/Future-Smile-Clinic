"use client";

import React, { useEffect, useRef } from "react";
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
      if (!toothEl || !rootEl) return;
      try {
        const circle = document.querySelector(
          "[data-hero-circle]"
        ) as HTMLElement | null;
        if (!circle) return;

        const rootRect = rootEl.getBoundingClientRect();
        const circleRect = circle.getBoundingClientRect();

        // Compute the distance from the root's bottom to the circle's bottom
        // and set tooth bottom so its bottom sits 20px above the circle bottom.
        // toothBottomPx is measured relative to the root container.
        const gap = 20; // pixels desired between tooth bottom and circle bottom
        const distanceFromRootBottomToCircleBottom =
          rootRect.bottom - circleRect.bottom;

        // If circle extends beyond root (negative), clamp to 0.
        const clamped = Math.max(0, distanceFromRootBottomToCircleBottom + gap);

        // Position the tooth element by setting its inline bottom style
        // so it's anchored inside the root container.
        toothEl.style.position = "absolute";
        toothEl.style.bottom = `${clamped}px`;
      } catch (e) {
        // silent fail
      }
    }

    // Initial positioning
    updateToothPosition();

    // Observe resizes on the circle element and the root container
    const circleEl = document.querySelector(
      "[data-hero-circle]"
    ) as HTMLElement | null;
    try {
      ro = new ResizeObserver(() => updateToothPosition());
  if (circleEl) ro.observe(circleEl);
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
    </section>
  );
}
