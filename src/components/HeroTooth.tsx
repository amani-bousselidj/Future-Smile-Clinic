"use client";

import React, { useEffect, useRef } from "react";
import styles from "./HeroTooth.module.css";

export default function HeroTooth(): JSX.Element {
  const rootRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const toothRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
      lastY = window.scrollY;
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          const y = lastY;
          if (bgRef.current) {
            // background moves slower = parallax depth 0.25
            bgRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`;
          }
          if (toothRef.current) {
            // tooth layer moves a bit more (creates depth)
            toothRef.current.style.transform = `translate3d(0, ${
              y * 0.45
            }px, 0)`;
          }
          ticking = false;
        });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

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
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      io.disconnect();
    };
  }, []);

  return (
    <section className={styles.hero} ref={rootRef} aria-label="Hero Section">
      {/* Layer 1 — Background (z-index:1) */}
      <div className={`${styles.layer} ${styles.bg}`} ref={bgRef} aria-hidden>
        <picture>
          <source type="image/webp" srcSet="/images/background.webp" />
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
          <source type="image/webp" srcSet="/images/tooth.webp" />
          <img
            src="/images/tooth.png"
            alt="tooth"
            loading="lazy"
            decoding="async"
            style={{
              maxWidth: "48vw",
              width: "520px",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </picture>
      </div>

      {/* Layer 4 — Foreground: nav + front text (z-index:4) */}
      <div className={`${styles.layer} ${styles.foreground}`}>
        <nav className={styles.navBar} aria-label="Primary">
          <div className={styles.links} role="menubar">
            <a className={styles.link} href="#about">
              Про клініку
            </a>
            <a className={styles.link} href="#services">
              Послуги
            </a>
            <a className={styles.link} href="#doctors">
              Лікарі
            </a>
            <a className={styles.link} href="#stories">
              Історії пацієнтів
            </a>
            <a className={styles.link} href="#book">
              Запис Онлайн
            </a>
          </div>
        </nav>

        <div className={styles.headlineWrap} aria-hidden={false}>
          <div className={`${styles.headline} ${styles.offset}`}>
            КОМФОРТНА СТОМАТОЛО
          </div>
          <div className={styles.subline}>
            Сучасна клініка — індивідуальний підхід, безболісні процедури,
            привітний колектив.
          </div>
        </div>
      </div>
    </section>
  );
}
