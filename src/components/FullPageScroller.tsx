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
  scrollableSlideIndex?: number;
};

export function FullPageScroller({
  children,
  enabled = true,
  durationMs = 700,
  scrollableSlideIndex = -1,
}: FullPageScrollerProps) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const [index, setIndex] = useState(0);
  const animatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const horizontalGestureRef = useRef(false);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      setIndex((prev) => {
        if (clamped === prev) return prev;
        if (animatingRef.current) return prev;

        animatingRef.current = true;
        window.setTimeout(() => {
          animatingRef.current = false;
        }, durationMs);
        return clamped;
      });
    },
    [durationMs, slides.length]
  );

  useEffect(() => {
    const onGo = (e: Event) => {
      const ce = e as CustomEvent<{ index?: number }>;
      const targetIndex = ce.detail?.index;
      if (typeof targetIndex !== "number") return;
      go(targetIndex);
    };

    window.addEventListener("fps:go", onGo as EventListener);
    return () => {
      window.removeEventListener("fps:go", onGo as EventListener);
    };
  }, [go]);

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

      // We are in "presentation mode" — block native scrolling entirely.
      e.preventDefault();

      // Trackpads can generate tiny deltas; ignore noise
      const dy = e.deltaY;
      if (Math.abs(dy) < 12) return;

      const dir: "up" | "down" = dy > 0 ? "down" : "up";

      // At the bounds, do nothing (still no native scroll).
      if (dir === "up" && index === 0) return;
      if (dir === "down" && index === slides.length - 1) return;

      // If current slide can scroll internally, keep it (only when explicitly enabled).
      if (scrollableSlideIndex === index && canScrollWithinSlide(dir)) return;

      // Otherwise, treat it as slide navigation
      if (dir === "down") go(index + 1);
      else go(index - 1);
    },
    [
      enabled,
      slides.length,
      scrollableSlideIndex,
      canScrollWithinSlide,
      go,
      index,
    ]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      if (slides.length <= 1) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (index >= slides.length - 1) return;
        go(index + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (index <= 0) return;
        go(index - 1);
      }
    },
    [enabled, slides.length, go, index]
  );

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      const t = e.touches[0];
      touchStartYRef.current = t?.clientY ?? null;
      touchStartXRef.current = t?.clientX ?? null;
      horizontalGestureRef.current = false;
    },
    [enabled]
  );

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      if (slides.length <= 1) return;

      // If the user was swiping horizontally (e.g., inside a horizontal carousel),
      // do not treat it as slide navigation.
      if (horizontalGestureRef.current) {
        touchStartYRef.current = null;
        touchStartXRef.current = null;
        horizontalGestureRef.current = false;
        return;
      }

      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      touchStartXRef.current = null;
      if (startY == null) return;

      const endY = e.changedTouches[0]?.clientY;
      if (endY == null) return;

      const dy = startY - endY;
      if (Math.abs(dy) < 35) return;

      const dir: "up" | "down" = dy > 0 ? "down" : "up";

      if (dir === "up" && index === 0) return;
      if (dir === "down" && index === slides.length - 1) return;

      // If slide can scroll, let it
      if (scrollableSlideIndex === index && canScrollWithinSlide(dir)) return;

      if (dir === "down") go(index + 1);
      else go(index - 1);
    },
    [
      enabled,
      slides.length,
      scrollableSlideIndex,
      canScrollWithinSlide,
      go,
      index,
    ]
  );

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      // Allow native scroll inside a designated scrollable slide.
      if (scrollableSlideIndex === index) return;

      const startX = touchStartXRef.current;
      const startY = touchStartYRef.current;
      const t = e.touches[0];
      const x = t?.clientX;
      const y = t?.clientY;

      if (startX != null && startY != null && x != null && y != null) {
        const dx = x - startX;
        const dy = y - startY;

        // If gesture is primarily horizontal, allow it (so inner carousels can scroll).
        if (Math.abs(dx) > Math.abs(dy) + 8) {
          horizontalGestureRef.current = true;
          return;
        }
      }

      // Otherwise, prevent native touch scrolling while in presentation mode.
      e.preventDefault();
    },
    [enabled, index, scrollableSlideIndex]
  );

  useEffect(() => {
    // Only attach listeners when enabled; keep them passive:false so we can preventDefault.
    if (!enabled) return;

    const prevScrollRestoration =
      typeof history !== "undefined" ? history.scrollRestoration : undefined;
    if (typeof history !== "undefined") {
      try {
        history.scrollRestoration = "manual";
      } catch {
        // ignore
      }
    }

    // Ensure we always start at the top when entering "presentation mode".
    // Otherwise a refresh can restore a previous scrollY and then get "stuck"
    // once overflow is locked.
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    } catch {
      // ignore
    }

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverscroll = (document.documentElement.style as any)
      .overscrollBehavior;
    const prevBodyOverscroll = (document.body.style as any).overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    (document.documentElement.style as any).overscrollBehavior = "none";
    (document.body.style as any).overscrollBehavior = "none";

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("keydown", onKeyDown as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      window.removeEventListener("touchend", onTouchEnd as any);

      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      (document.documentElement.style as any).overscrollBehavior =
        prevHtmlOverscroll;
      (document.body.style as any).overscrollBehavior = prevBodyOverscroll;

      if (typeof history !== "undefined" && prevScrollRestoration) {
        try {
          history.scrollRestoration = prevScrollRestoration;
        } catch {
          // ignore
        }
      }
    };
  }, [enabled, onWheel, onKeyDown, onTouchStart, onTouchMove, onTouchEnd]);

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
              overflowY: i === scrollableSlideIndex ? "auto" : "hidden",
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
