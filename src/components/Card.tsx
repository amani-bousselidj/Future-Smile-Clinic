/**
 * Card Component - Container component
 */
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: "none" | "sm" | "md" | "lg";
  padding?: "none" | "sm" | "md" | "lg";
}

const shadowClasses = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  shadow = "md",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200
        ${shadowClasses[shadow]}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
