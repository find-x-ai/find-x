import { NextResponse } from "next/server";

export function handleAuthenticatedUser(url: URL): NextResponse {
  if (isAuthRoute(url.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", url));
  }
  return NextResponse.next();
}

export function handleNewAccessToken(url: URL, token: string): NextResponse {
  if (isAuthRoute(url.pathname)) {
    const response = NextResponse.redirect(new URL("/dashboard", url));
    response.cookies.set("_a_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 30,
      path: "/",
    });
    return response;
  }

  const response = NextResponse.next();
  response.cookies.set("_a_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30,
    path: "/",
  });
  return response;
}

export function handleUnauthenticatedUser(url: URL): NextResponse {
  if (url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", url));
  }
  return NextResponse.next();
}

function isAuthRoute(pathname: string): boolean {
  return ["/login", "/register", "/magic"].some((route) =>
    pathname.startsWith(route)
  );
}
