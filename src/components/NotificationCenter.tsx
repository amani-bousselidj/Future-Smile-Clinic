/**
 * NotificationCenter - Display notifications from app context
 */
"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function NotificationCenter() {
  const { notifications, removeNotification } = useApp();

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 space-y-3 max-w-sm sm:max-w-md mx-auto sm:mx-0">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            border rounded-lg p-4 sm:p-5 shadow-xl animate-in slide-in-from-top-4 duration-300
            ${getBackgroundColor(notification.type)}
            ${getTextColor(notification.type)}
          `}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-base sm:text-lg font-semibold leading-relaxed">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-xl sm:text-2xl hover:opacity-70 transition-opacity p-1"
              aria-label="إغلاق"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
