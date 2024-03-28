import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Handle preflight requests (OPTIONS)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200 }); // Return a 200 OK status for preflight requests
  }

  // Handle regular requests
  const res = NextResponse.next();

//   Add CORS headers to the response
  res.headers.set("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.headers.set("Access-Control-Allow-Methods", "GET, DELETE, PATCH, POST, PUT");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   Optionally, you can allow credentials if needed
  res.headers.set("Access-Control-Allow-Credentials", "true");

  // Return the response with CORS headers
  return res;
}

// Specify the path regex to apply the middleware to
export const config = {
  matcher: "/api/:path*", // Apply the middleware to all routes under /api
};
