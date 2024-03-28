import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function OPTIONS(request: NextRequest){
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(req: NextRequest) {
  // Get the origin header from the request
  const origin = req.headers.get("origin");
  console.log("origin is " + origin);


  const { query } = await req.json();
  const apiResponse: any = await fetch("https://sahilm416--query.modal.run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client: "100", query: query }),
  });

  if (!apiResponse.ok) {
    throw new Error(
      `Failed to fetch: ${apiResponse.status} ${apiResponse.statusText}`
    );
  }

  return new StreamingTextResponse(apiResponse.body, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
