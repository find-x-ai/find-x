import { StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest, res: NextResponse) {

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200 }); // Return a 200 OK status for preflight requests
  }
  const { query } = await req.json();

  const response = (await fetch("https://sahilm416--query.modal.run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client: "100",
      query: query,
    }),
  })) as any;
  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`
    );
  }
  return new StreamingTextResponse(response.body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, DELETE, PATCH, POST, PUT",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
