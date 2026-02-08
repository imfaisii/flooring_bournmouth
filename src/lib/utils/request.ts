import { NextRequest } from "next/server";

export function getClientIP(req: NextRequest): string {
  // Check various headers for proxied requests
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Vercel specific
  const vercelForwardedFor = req.headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0].trim();
  }

  // Fallback for local development
  return "127.0.0.1";
}
