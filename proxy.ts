import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {jwtVerify} from "jose";

const COOKIE_NAME = "pyg_auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const {pathname} = request.nextUrl;
  const isPublicRoute = pathname.startsWith("/auth");

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      await jwtVerify(token, secret);

      if (isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      if (!isPublicRoute) {
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url),
        );
        response.cookies.delete(COOKIE_NAME);
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
