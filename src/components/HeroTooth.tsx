"use client";

import React from "react";

export default function HeroTooth() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-blue-50 via-green-50 to-white">
      <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 py-24 lg:py-32">
        <div className="relative">
          {/* SVG layer: large text with mask so text is hidden where tooth is */}
          <svg
            className="w-full h-[420px] md:h-[520px] block"
            viewBox="0 0 1400 420"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* A simple tooth-like path used as mask - adjust if you have an exact SVG */}
              <clipPath id="toothClip">
                <path
                  d="M710 70c22-30 58-30 80 0 24 34 18 58 6 84-12 26-26 38-34 68-8 30-2 60-6 84-4 24-22 42-44 42s-40-18-44-42c-4-24 2-54-6-84-8-30-22-42-34-68-12-26-18-50 6-84 22-30 58-30 80 0z"
                  fill="#fff"
                />
              </clipPath>

              {/* mask that hides the text inside the tooth shape */}
              <mask id="toothMask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <path
                  d="M710 70c22-30 58-30 80 0 24 34 18 58 6 84-12 26-26 38-34 68-8 30-2 60-6 84-4 24-22 42-44 42s-40-18-44-42c-4-24 2-54-6-84-8-30-22-42-34-68-12-26-18-50 6-84 22-30 58-30 80 0z"
                  fill="black"
                />
              </mask>
            </defs>

            {/* large background text - will be visible except where masked by tooth */}
            <g mask="url(#toothMask)">
              <rect width="100%" height="100%" fill="transparent" />
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                fontFamily="Inter, system-ui, Arial"
                fontWeight={800}
                fontSize="120"
                fill="#D6E8E8"
                style={{ letterSpacing: "-0.02em" }}
              >
                Future Smile Clinic
              </text>
            </g>
          </svg>

          {/* Tooth image above the text - uses existing clinic hero image as a fallback */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <img
              src="/images/clinic-hero.png"
              alt="tooth"
              className="w-[480px] md:w-[620px] lg:w-[720px] object-contain rounded-lg shadow-xl"
              style={{ filter: "brightness(1.02) contrast(0.95)" }}
            />
          </div>

          {/* Foreground content placeholder (title + CTA) */}
          <div className="relative z-20 pt-12 lg:pt-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              ابتسامتك تستحق الأفضل
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              رعاية متقدمة، أطباء متخصصين، وبيئة مريحة للعائلة كاملة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
