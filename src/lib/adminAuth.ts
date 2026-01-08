import { cookies } from "next/headers";

export const ADMIN_ACCESS_COOKIE = "fsc_admin_access";
export const ADMIN_REFRESH_COOKIE = "fsc_admin_refresh";

export function getAdminTokens() {
  const store = cookies();
  const access = store.get(ADMIN_ACCESS_COOKIE)?.value || "";
  const refresh = store.get(ADMIN_REFRESH_COOKIE)?.value || "";
  return { access, refresh };
}

export function adminCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
  };
}
