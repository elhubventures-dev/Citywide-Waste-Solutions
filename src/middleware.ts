import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/auth.config";
import { isRelocateHost } from "@/lib/moving/paths";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const request = req as NextRequest;
  const host = request.headers.get("host") ?? "";
  const { pathname } = request.nextUrl;
  const onRelocateSubdomain = isRelocateHost(host);

  // Subdomain: serve /relocate/* routes at clean paths (e.g. /services → /relocate/services)
  if (onRelocateSubdomain) {
    const isInternal =
      pathname.startsWith("/relocate") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/studio") ||
      pathname.startsWith("/admin");

    if (!isInternal) {
      const url = request.nextUrl.clone();
      url.pathname = `/relocate${pathname === "/" ? "" : pathname}`;
      const response = NextResponse.rewrite(url);
      response.headers.set("x-relocate-site", "1");
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("x-relocate-site", "1");
    return response;
  }

  // Main domain: allow /relocate in development for local preview
  if (
    pathname.startsWith("/relocate") &&
    process.env.NODE_ENV === "production" &&
    process.env.RELOCATE_PREVIEW !== "true"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
