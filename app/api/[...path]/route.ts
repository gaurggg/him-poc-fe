import { NextRequest, NextResponse } from "next/server";

const BACKEND = "https://technosportpocapi.atinity.com";

async function handler(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const backendPath = pathname.replace(/^\/api/, "");
  let url = `${BACKEND}${backendPath}${search}`;

  const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

  // Follow redirects manually to preserve method (fetch changes POST→GET on 301)
  let res = await fetch(url, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "manual",
  });

  if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
    const location = res.headers.get("location");
    if (location) {
      const redirectUrl = location.startsWith("http") ? location : `${BACKEND}${location}`;
      res = await fetch(redirectUrl.replace(/^http:\/\//, "https://"), {
        method: req.method,
        headers: { "Content-Type": "application/json" },
        body,
        redirect: "follow",
      });
    }
  }

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
