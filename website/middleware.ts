import { NextResponse } from "next/server";

export function middleware(request : Request) {
    // retrieve the current response
    const res = NextResponse.next()
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res
}

// specify the path regex to apply the middleware to
export const config = {
    matcher: '/api/:path*',
}