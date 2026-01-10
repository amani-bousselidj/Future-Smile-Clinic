import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";
import { ADMIN_ACCESS_COOKIE, adminCookieOptions, getAdminTokens } from "@/lib/adminAuth";

const ALLOWED_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

function sanitizedUpstreamHeaders(upstream: Response) {
  const headers = new Headers(upstream.headers);
  // Node's fetch typically auto-decompresses, but may keep these headers.
  // Forwarding them can trigger browser decoding errors.
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  return headers;
}

async function refreshAccessToken(refresh: string) {
  const r = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

async function forward(req: Request, pathname: string, accessToken: string) {
  const url = new URL(req.url);
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const target = `${API_BASE_URL}/${normalized}${url.search}`;

  // IMPORTANT: Do not forward Vercel/edge proxy headers to Django.
  // Forwarding `x-forwarded-host` can trigger Django DisallowedHost.
  const headers = new Headers();
  headers.set("accept", "application/json");
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

  const method = req.method.toUpperCase();
  const init: RequestInit = { method, headers, redirect: "manual" };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  return fetch(target, init);
}

async function handler(req: Request, params: { path: string[] }) {
  const method = req.method.toUpperCase();
  if (!ALLOWED_METHODS.includes(method as any)) {
    return NextResponse.json({ detail: "Method not allowed" }, { status: 405 });
  }

  const { access, refresh } = getAdminTokens();
  if (!access) {
    return NextResponse.json(
      { detail: "Not authenticated", hasAccess: false, hasRefresh: Boolean(refresh) },
      { status: 401 }
    );
  }

  const pathname = params.path.join("/");
  let upstream = await forward(req, pathname, access);

  if (upstream.status === 401 && refresh) {
    const refreshed = await refreshAccessToken(refresh);
    const nextAccess = refreshed.data?.access;
    if (refreshed.ok && nextAccess) {
      upstream = await forward(req, pathname, nextAccess);
      const body = await upstream.arrayBuffer();
      const res = new NextResponse(body, {
        status: upstream.status,
        headers: sanitizedUpstreamHeaders(upstream),
      });
      res.cookies.set(ADMIN_ACCESS_COOKIE, nextAccess, adminCookieOptions());
      return res;
    }
  }

  // If still unauthorized (or no refresh token), normalize the response and clear cookies.
  if (upstream.status === 401) {
    const res = NextResponse.json({ detail: "Session expired" }, { status: 401 });
    res.cookies.set(ADMIN_ACCESS_COOKIE, "", { ...adminCookieOptions(), maxAge: 0 });
    return res;
  }

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    status: upstream.status,
    headers: sanitizedUpstreamHeaders(upstream),
  });
}

export async function GET(req: Request, ctx: { params: { path: string[] } }) {
  return handler(req, ctx.params);
}
export async function POST(req: Request, ctx: { params: { path: string[] } }) {
  return handler(req, ctx.params);
}
export async function PUT(req: Request, ctx: { params: { path: string[] } }) {
  return handler(req, ctx.params);
}
export async function PATCH(req: Request, ctx: { params: { path: string[] } }) {
  return handler(req, ctx.params);
}
export async function DELETE(req: Request, ctx: { params: { path: string[] } }) {
  return handler(req, ctx.params);
}
