import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse, GoogleGenerativeAIStream } from "ai";

export const runtime = "edge";

const instructions = `You're an ai search assistant, who helps users to solve their queries. You get the following XML as input :
<message>
   <query>User's query about the website</query>
   <chunks>
      <page>
        <url>https://example.com/abc</url>
        <content>Data found on the page</content>
      </page>
      <page>
        <url>https://example.com/xyz</url>
        <content>Data found on the second page</content>
      </page>        
   </chunks>
</message>
Response :
You just take the XML data and check wheather is there any chance that the query in XML data is related to the page data , if no then deny the request by "Cannot assists with this request." or "Please provide more context !" according yo the situation. If data and query
 are related then undersatnd the query and prepare a answer for that query from the recieved page data and respond with it. You can greet if query is a greeting like "How can i assist you today ?". Keep the responses short , you are allowed to summarise the pages data . After response you add the "<-$#$->" symbol and add page urls separated by comma. No need to add any symbol and urls if query was a greeting or denial of request.
`;

export async function OPTIONS(request: NextRequest) {
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
  const { query } = await req.json();

  const key = req.headers.get("Authorization") as string;

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 19000,
    responseMimeType: "text/plain",
  };

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instructions,
    generationConfig: generationConfig,
  });

  const res = await model.generateContentStream(query);

  const stream = GoogleGenerativeAIStream(res);

  return new StreamingTextResponse(stream, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
