"use client";

import React, { useState, useEffect } from "react";

type Phase = "badge-enter" | "text-show" | "loading" | "hero-transform" | "final-zoom" | "hidden";

export const LoadingSplash: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("badge-enter");
  const [loaderPosition, setLoaderPosition] = useState(0);

  const clinicName = "Future Smile Clinic";

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: Text appears after 0.5s
    timers.push(
      setTimeout(() => {
        setPhase("text-show");
      }, 500)
    );

    // Phase 2: Loading starts (0.5-1s)
    timers.push(
      setTimeout(() => {
        setPhase("loading");
      }, 1000)
    );

    // Phase 3: Loading bar slides (1-3s)
    let startTime = Date.now();
    const loadingDuration = 2000; // 2 seconds
    
    const loadingInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / loadingDuration, 1);
      setLoaderPosition(progress * 100);
      
      if (progress >= 1) {
        clearInterval(loadingInterval);
      }
    }, 16);

    timers.push(loadingInterval as any);

    // Phase 4: Transform to hero with image (3-4.5s)
    timers.push(
      setTimeout(() => {
        setPhase("hero-transform");
      }, 3000)
    );

    // Phase 5: Final zoom out (4.5-5.5s)
    timers.push(
      setTimeout(() => {
        setPhase("final-zoom");
      }, 4500)
    );

    // Phase 6: Hide completely (5.5s)
    timers.push(
      setTimeout(() => {
        setPhase("hidden");
      }, 5500)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  if (phase === "hidden") return null;

  const getBadgeAnimation = () => {
    if (phase === "badge-enter" || phase === "text-show" || phase === "loading") return "badgeBreathe 2.5s ease-in-out infinite";
    if (phase === "hero-transform") return "badgeGrow 1.5s ease-in-out forwards";
    if (phase === "final-zoom") return "badgeFinalZoom 1s ease-in-out forwards";
    return "none";
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1F1F1F] transition-opacity duration-700 ${
        phase === "final-zoom" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-16">
        {/* Main Badge/Capsule */}
        <div
          className="relative overflow-hidden"
          style={{
            animation: getBadgeAnimation(),
            width: phase === "hero-transform" || phase === "final-zoom" ? "85vw" : "auto",
            maxWidth: phase === "hero-transform" || phase === "final-zoom" ? "1200px" : "700px",
            height: phase === "hero-transform" || phase === "final-zoom" ? "280px" : "auto",
            transition: "width 1.5s ease-in-out, height 1.5s ease-in-out",
          }}
        >
          <div
            className="relative rounded-full shadow-2xl"
            style={{
              backgroundColor: phase === "hero-transform" || phase === "final-zoom" ? "#ffffff" : "#3A3A3A",
              padding: phase === "hero-transform" || phase === "final-zoom" ? "0" : "28px 80px",
              borderRadius: "9999px",
              transition: "background-color 1s ease-in-out, padding 1.5s ease-in-out",
            }}
          >
            {/* Loading Bar Slider (White Circle) */}
            {phase === "loading" && (
              <div
                className="absolute top-0 bottom-0 left-0 bg-white rounded-full transition-all duration-100"
                style={{
                  width: `${loaderPosition}%`,
                  zIndex: 1,
                }}
              />
            )}

            {/* Text Content */}
            {(phase === "text-show" || phase === "loading") && (
              <div
                className="relative z-10 flex items-center justify-center whitespace-nowrap"
                style={{
                  animation: phase === "text-show" ? "textFadeIn 0.5s ease-out forwards" : "none",
                  opacity: phase === "text-show" ? 0 : 1,
                }}
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                  {clinicName.split("").map((letter, index) => {
                    const charPosition = (index / clinicName.length) * 100;
                    const isInverted = phase === "loading" && loaderPosition > charPosition;
                    
                    return (
                      <span
                        key={index}
                        className="transition-all duration-200"
                        style={{
                          color: isInverted ? "#1F1F1F" : "#ffffff",
                        }}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
              </div>
            )}

            {/* Hero Image (appears in hero-transform phase) */}
            {(phase === "hero-transform" || phase === "final-zoom") && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation: "imageFadeIn 1s ease-out forwards",
                  opacity: 0,
                }}
              >
                <img
                  src="/images/clinic-hero.jpg"
                  alt="Future Smile Clinic"
                  className="w-full h-full object-cover rounded-full opacity-20"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=400&fit=crop";
                  }}
                  style={{
                    filter: "brightness(1.2) contrast(0.9)",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Subtitle Text (appears in hero-transform phase) */}
        {(phase === "hero-transform" || phase === "final-zoom") && (
          <p
            className="text-gray-400 text-xs sm:text-sm font-light tracking-wide text-center max-w-xl px-4"
            style={{
              animation: "subtitleFadeIn 1s ease-out 0.5s forwards",
              opacity: 0,
            }}
          >
            Future Smile Clinic — عيادة أسنان عصرية ومريحة لكل أفراد العائلة
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes badgeEnter {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes badgeBreathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @keyframes badgeGrow {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.2);
          }
        }

        @keyframes badgeFinalZoom {
          0% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(20);
            opacity: 0;
          }
        }

        @keyframes textFadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes imageFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes subtitleFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
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
