import { NextResponse } from "next/server";
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE } from "@/lib/adminAuth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(ADMIN_REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
