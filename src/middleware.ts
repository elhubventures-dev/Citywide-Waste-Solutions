import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminEmails, isClerkConfigured } from "@/lib/auth";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

const isAdminApiRoute = createRouteMatcher(["/api/admin(.*)"]);

function unauthorizedResponse(req: NextRequest) {
  if (isAdminApiRoute(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.redirect(new URL("/sign-in", req.url));
}

export default isClerkConfigured()
  ? clerkMiddleware(async (auth, req) => {
      if (isAdminRoute(req)) {
        const { userId } = await auth.protect();
        const adminEmails = getAdminEmails();

        if (adminEmails.size === 0) {
          return unauthorizedResponse(req);
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const userEmails = user.emailAddresses.map((email) => email.emailAddress.toLowerCase());

        if (!userEmails.some((email) => adminEmails.has(email))) {
          return unauthorizedResponse(req);
        }
      }
    })
  : function middleware(req: NextRequest) {
      if (isAdminRoute(req)) {
        return unauthorizedResponse(req);
      }

      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|ttf|woff2?|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
