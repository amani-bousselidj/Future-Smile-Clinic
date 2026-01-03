"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type FullPageScrollerProps = {
  children: React.ReactNode;
  enabled?: boolean;
  durationMs?: number;
};

export function FullPageScroller({
  children,
  enabled = true,
  durationMs = 700,
}: FullPageScrollerProps) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const [index, setIndex] = useState(0);
  const animatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      if (clamped === index) return;
      if (animatingRef.current) return;

      animatingRef.current = true;
      setIndex(clamped);
      window.setTimeout(() => {
        animatingRef.current = false;
      }, durationMs);
    },
    [durationMs, index, slides.length]
  );

  const canScrollWithinSlide = useCallback(
    (dir: "up" | "down") => {
      const el = slideRefs.current[index];
      if (!el) return false;

      // Find first scrollable descendant we control (the slide container itself)
      const scrollTop = el.scrollTop;
      const maxScrollTop = el.scrollHeight - el.clientHeight;

      if (maxScrollTop <= 1) return false;

      if (dir === "down") return scrollTop < maxScrollTop - 1;
      return scrollTop > 1;
    },
    [index]
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (!enabled) return;
      if (slides.length <= 1) return;

      // Trackpads can generate tiny deltas; ignore noise
      const dy = e.deltaY;
      if (Math.abs(dy) < 12) return;

      const dir: "up" | "down" = dy > 0 ? "down" : "up";

      // At the bounds, never block the default scroll behavior.
      if (dir === "up" && index === 0) return;
      if (dir === "down" && index === slides.length - 1) return;

      // If current slide can scroll internally, allow normal scroll
      if (canScrollWithinSlide(dir)) return;

      // Otherwise, treat it as slide navigation
      e.preventDefault();
      if (dir === "down") go(index + 1);
      else go(index - 1);
    },
    [enabled, slides.length, canScrollWithinSlide, go, index]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      if (slides.length <= 1) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (index >= slides.length - 1) return;
        e.preventDefault();
        go(index + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (index <= 0) return;
        e.preventDefault();
        go(index - 1);
      }
    },
    [enabled, slides.length, go, index]
  );

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    },
    [enabled]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      if (slides.length <= 1) return;

      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (startY == null) return;

      const endY = e.changedTouches[0]?.clientY;
      if (endY == null) return;

      const dy = startY - endY;
      if (Math.abs(dy) < 35) return;

      const dir: "up" | "down" = dy > 0 ? "down" : "up";

      if (dir === "up" && index === 0) return;
      if (dir === "down" && index === slides.length - 1) return;

      // If slide can scroll, let it
      if (canScrollWithinSlide(dir)) return;

      if (dir === "down") go(index + 1);
      else go(index - 1);
    },
    [enabled, slides.length, canScrollWithinSlide, go, index]
  );

  useEffect(() => {
    // Only attach listeners when enabled; keep them passive:false so we can preventDefault.
    if (!enabled) return;

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKeyDown as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchend", onTouchEnd as any);
    };
  }, [enabled, onWheel, onKeyDown, onTouchStart, onTouchEnd]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="h-full w-full"
        style={{
          transform: `translateY(-${index * 100}vh)`,
          transition: `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          willChange: "transform",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="h-screen w-full"
            style={{
              overflowY: i === 1 ? "auto" : "hidden",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
