import { NextRequest, NextResponse } from "next/server";
import { checkAccessToken, newAccessToken } from "./actions/jwt";
import {
  handleAuthenticatedUser,
  handleNewAccessToken,
  handleUnauthenticatedUser,
} from "./actions/middleware";

export const middleware = async (req: NextRequest) => {
  const url = req.nextUrl.clone();

  // Handle root redirect
  if (url.pathname === "/home") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Handle docs redirect
  if (url.pathname === "/docs") {
    return NextResponse.redirect(new URL("/docs/getting_started", req.url));
  }

  //Handle dashboard redirect
  if (url.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard/indexing", req.url));
  }

  const access = await checkAccessToken(req);

  if (access.success) {
    return handleAuthenticatedUser(url);
  }

  const newAccess = await newAccessToken(req);

  if (newAccess?.token && newAccess.success) {
    return handleNewAccessToken(url, newAccess.token);
  }

  return handleUnauthenticatedUser(url);
};

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/magic/:path*",
    "/",
    "/docs",
    "/home",
  ],
};
