import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export async function POST(req: NextRequest) {
  // Get the origin header from the request
  const origin = req.headers.get("Origin");

  // Handle OPTIONS preflight requests
  if (req.method === "OPTIONS") {
    const allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
    const allowedHeaders = ["Content-Type", "Authorization"];

    const response = new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin || "*",
        "Access-Control-Allow-Methods": allowedMethods.join(", "),
        "Access-Control-Allow-Headers": allowedHeaders.join(", "),
        "Access-Control-Allow-Credentials": "true",
      },
    });

    return response;
  }

  // Handle other requests
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", origin || "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  const { query } = await req.json();
  const response = (await fetch("https://sahilm416--query.modal.run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client: "100", query: query }),
  })) as any;

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  return new StreamingTextResponse(response.body);
}