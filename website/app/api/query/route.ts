import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"
export async function POST(req: NextRequest) {
  const response = NextResponse.next();

  // Get the origin header from the request
  const origin = req.headers.get("Origin");

  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  // Set CORS headers for actual requests
  response.headers.set("Access-Control-Allow-Origin", origin || "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  const { query } = await req.json();
  const apiResponse : any = await fetch("https://sahilm416--query.modal.run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client: "100", query: query }),
  });

  if (!apiResponse.ok) {
    throw new Error(`Failed to fetch: ${apiResponse.status} ${apiResponse.statusText}`);
  }

  return new StreamingTextResponse(apiResponse.body);
}