import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "connect-src 'self' http://localhost:4000 https://api.brevo.com https://accounts.google.com",
  "frame-src https://accounts.google.com",
].join("; ");

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", CSP);
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
