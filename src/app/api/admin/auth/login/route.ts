import { NextResponse } from "next/server";
import { ADMIN_ACCESS_COOKIE, ADMIN_REFRESH_COOKIE, adminCookieOptions } from "@/lib/adminAuth";
import { API_BASE_URL } from "@/lib/config";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  const raw = await req.text().catch(() => "");
  const body = (() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();

  const identifier = body?.identifier ?? body?.email ?? body?.username;
  const password = body?.password;

  if (!identifier || !password) {
    return NextResponse.json(
      {
        detail: "identifier and password required",
        contentType,
        rawLength: raw.length,
        receivedKeys: body && typeof body === "object" ? Object.keys(body) : [],
        hasIdentifier: Boolean(identifier),
        hasPassword: Boolean(password),
      },
      { status: 400 }
    );
  }

  const tokenRes = await fetch(`${API_BASE_URL}/api/admin/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // backend accepts email OR username in the 'username' field
    body: JSON.stringify({ username: identifier, password }),
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
