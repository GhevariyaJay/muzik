import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/app/lib/auth";

// Explicitly type req as NextRequest with an optional auth property to avoid
// the 'never' inference and to allow TypeScript to recognize req.auth.
export default auth((req: NextRequest & { auth?: unknown }) => {
  const isLoggedIn = !!req.auth;
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};