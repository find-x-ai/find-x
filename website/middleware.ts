import { NextResponse } from "next/server";

export function middleware() {
    // retrieve the current response
    const res = NextResponse.next()

    return res
}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
}