"use client";

import { useEffect } from "react";

/**
 * StorageCleanup: Clears stale or invalid auth data from localStorage on first load
 * This ensures old/expired tokens don't cause 401 errors
 */
export default function StorageCleanup() {
  useEffect(() => {
    // Only run once, on client side
    if (typeof window === "undefined") return;

    try {
      // Check if we have auth tokens
      const accessToken = localStorage.getItem("access_token");
      const user = localStorage.getItem("user");

      // If we have tokens but they look invalid (too short, malformed), clear them
      // JWT tokens are typically 500+ characters
      if (accessToken && accessToken.length < 100) {
        console.log("🧹 Clearing invalid auth token from localStorage");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      }

      // Also clear if user data is invalid JSON
      if (user) {
        try {
          JSON.parse(user);
        } catch {
          console.log("🧹 Clearing invalid user data from localStorage");
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      }
    } catch (error) {
      console.error("Error during storage cleanup:", error);
    }
  }, []);

  return null; // This component doesn't render anything
}
