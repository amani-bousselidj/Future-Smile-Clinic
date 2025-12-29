"use client";

import React, { useState, useEffect } from "react";

export const LoadingSplash: React.FC = () => {
  const [phase, setPhase] = useState<"badge-enter" | "text-show" | "loading" | "zoom" | "hidden">("badge-enter");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const clinicName = "Future Smile Clinic";
  const letters = clinicName.split("");

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Badge enters with breathe animation (0-0.8s)
    timers.push(
      setTimeout(() => {
        setPhase("text-show");
      }, 800)
    );

    // Phase 2: Text appears (0.8-1.3s)
    timers.push(
      setTimeout(() => {
        setPhase("loading");
      }, 1300)
    );

    // Phase 3: Loading wave effect (1.3-3.5s)
    // Simulate loading progress - each letter gets colored progressively
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= letters.length) {
          clearInterval(loadingInterval);
          return letters.length;
        }
        return prev + 1;
      });
    }, 90); // ~2.2s total for all letters

    timers.push(loadingInterval as any);

    // Phase 4: Start zoom (3.5s)
    timers.push(
      setTimeout(() => {
        setPhase("zoom");
      }, 3500)
    );

    // Phase 5: Hide completely (4s)
    timers.push(
      setTimeout(() => {
        setPhase("hidden");
      }, 4000)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [letters.length]);

  if (phase === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900 transition-opacity duration-500 ${
        phase === "zoom" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Badge Container */}
        <div
          className="relative px-16 sm:px-20 py-6 sm:py-8 bg-slate-800 rounded-full shadow-2xl overflow-hidden"
          style={{
            animation:
              phase === "badge-enter"
                ? "badgeEnter 0.8s ease-in-out forwards"
                : phase === "text-show" || phase === "loading"
                ? "badgeBreathe 2s ease-in-out infinite"
                : phase === "zoom"
                ? "badgeZoom 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                : "none",
          }}
        >
          {/* Text Content */}
          {(phase === "text-show" || phase === "loading" || phase === "zoom") && (
            <div
              className="relative z-10 flex items-center justify-center whitespace-nowrap"
              style={{
                animation: phase === "text-show" ? "textFadeIn 0.5s ease-out forwards" : "none",
                opacity: phase === "text-show" ? 0 : 1,
              }}
            >
              {letters.map((letter, index) => {
                const isLoaded = phase === "loading" && index < loadingProgress;
                const isSpace = letter === " ";
                
                return (
                  <span
                    key={index}
                    className={`text-3xl sm:text-4xl font-bold tracking-tight transition-all duration-300 ${
                      isSpace ? "inline-block w-3" : ""
                    }`}
                    style={{
                      color: isLoaded ? "#1e293b" : "#ffffff",
                      backgroundColor: isLoaded ? "#f1f5f9" : "transparent",
                      padding: isSpace ? "0" : "2px 4px",
                      borderRadius: "4px",
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes badgeEnter {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes badgeBreathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.04);
          }
        }

        @keyframes badgeZoom {
          0% {
            transform: scale(1);
            border-radius: 9999px;
            opacity: 1;
          }
          70% {
            opacity: 0.8;
            border-radius: 40px;
          }
          100% {
            transform: scale(14);
            border-radius: 0;
            opacity: 0;
          }
        }

        @keyframes textFadeIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
