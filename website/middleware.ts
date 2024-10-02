import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./actions/session";

export const middleware = async (req: NextRequest) => {
  const url = req.nextUrl.clone();
  if (url.pathname === "/") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  const session = await getSession();
  if (
    url.pathname === "/login" ||
    url.pathname === "/register" ||
    url.pathname.startsWith("/magic")
  ) {
    if (session.success) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    } else {
      return NextResponse.next();
    }
  }

  if (session.success) {
    return NextResponse.next();
  } else {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/magic/:path*", "/"],
};
