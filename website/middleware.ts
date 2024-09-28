import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const url = req.nextUrl.clone();

  if (url.pathname === "/") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }
};
