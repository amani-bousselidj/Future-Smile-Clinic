"use client";

import React from "react";

export default function HeroTooth() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-r from-blue-50 via-green-50 to-white">
      {/* Full-bleed SVG background with masked large text */}
      <svg
        className="absolute inset-0 w-full h-full block"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <mask id="toothMaskBg">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <path
              d="M800 220c30-40 80-40 110 0 33 46 25 78 8 113-17 35-38 52-50 92-12 40-3 80-8 113-5 33-28 58-56 58s-51-25-56-58c-5-33 3-73-8-113-12-40-33-57-50-92-17-35-25-67 8-113 30-40 80-40 110 0z"
              fill="#000"
            />
          </mask>
        </defs>

        <g mask="url(#toothMaskBg)">
          <rect width="100%" height="100%" fill="transparent" />
          <text
            x="50%"
            y="58%"
            textAnchor="middle"
            fontFamily="Inter, system-ui, Arial"
            fontWeight={900}
            fontSize="220"
            fill="#D6E8E8"
            style={{ letterSpacing: "-0.02em" }}
          >
            Future Smile Clinic
          </text>
        </g>
      </svg>

      {/* Centered tooth image and content */}
                <section
                  className="w-full min-h-screen bg-center bg-cover"
                  style={{ backgroundImage: "url('/images/clinic-hero.png')" }}
                >
                </section>
              <div className="mt-8 flex justify-center gap-4">
