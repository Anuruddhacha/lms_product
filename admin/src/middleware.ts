import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const secret = process.env.CLERK_SECRET_KEY?.trim();

  if (!publishable || !secret) {
    return new NextResponse(
      [
        "Clerk is not configured for this deployment.",
        "",
        "In Vercel: Project → Settings → Environment Variables, add for Production (and Preview if used):",
        "  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
        "  CLERK_SECRET_KEY",
        "",
        "Use the same values as in Clerk Dashboard → Configure → API Keys.",
        "Redeploy after saving variables.",
      ].join("\n"),
      {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" },
      }
    );
  }

  await auth();
  const userRole = process.env.ROLE ?? "teacher";

  if (isStudentRoute(req)) {
    if (userRole !== "student") {
      return NextResponse.redirect(new URL("/teacher/courses", req.url));
    }
  }

  if (isTeacherRoute(req)) {
    if (userRole !== "teacher") {
      return NextResponse.redirect(new URL("/user/courses", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
