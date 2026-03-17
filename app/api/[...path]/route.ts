import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://technosportpocapi.atinity.com";

async function handler(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  // Strip the leading /api prefix to get the real backend path
  const backendPath = pathname.replace(/^\/api/, "");
  const url = `${BACKEND}${backendPath}${search}`;

  const res = await fetch(url, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined,
    redirect: "follow",
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
