import { NextResponse } from "next/server";
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE, adminCookieOptions } from "@/lib/adminAuth";
import { API_BASE_URL } from "@/lib/config";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email;
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ detail: "email and password required" }, { status: 400 });
  }

  const tokenRes = await fetch(`${API_BASE_URL}/api/admin/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // backend accepts email OR username in the 'username' field
    body: JSON.stringify({ username: email, password }),
  });

  const data = await tokenRes.json().catch(() => ({}));
  if (!tokenRes.ok) {
    return NextResponse.json(data, { status: tokenRes.status });
  }

  const access = data?.access;
  const refresh = data?.refresh;
  if (!access || !refresh) {
    return NextResponse.json({ detail: "Invalid token response" }, { status: 502 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_ACCESS_COOKIE, access, adminCookieOptions());
  res.cookies.set(ADMIN_REFRESH_COOKIE, refresh, adminCookieOptions());
  return res;
}
