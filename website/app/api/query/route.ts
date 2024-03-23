import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
// Set the runtime to edge for best performance
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { query } = await req.json();

  const response = await fetch("https://sahilm416--query.modal.run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query
    })
  }) as any
  // const stream = OpenAIStream(response);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }


  return new StreamingTextResponse(response.body)
  
}