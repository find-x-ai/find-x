import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';
 
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  console.log("origin is " + origin);
  const { query } = await req.json();

  const response = await fetch("https://sahilm416--query.modal.run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client: "100",
      query: query
    })
  }) as any;
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }
  return new StreamingTextResponse(response.body , {
    headers: {
      "Access-Control-Allow-Origin" : origin || "*",
      "Content-Type" : "text/plain"
    }
  })
  
}