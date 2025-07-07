import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Check your exact cookie here:
  const token = req.cookies.get("sb-kgpcbbgyrlrxtswckwwm-auth-token")?.value;

  if (!token) {
    // Redirect to login if token doesn't exist
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"], // Protect your routes here
};
