import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/uploads/:path*", "/transactions/:path*", "/reports/:path*", "/settings/:path*"],
};
