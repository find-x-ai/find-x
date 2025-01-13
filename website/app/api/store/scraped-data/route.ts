import { NextResponse, NextRequest } from "next/server";
import { sql } from "@/lib/db";
import { ScrapedData } from "@/types";

export async function POST(request: NextRequest) {
  console.log('POST /api/store/scraped-data - Starting request');
  const secret = request.headers.get("Authorization")?.split(" ")[1];
  console.log('Received secret:', secret ? '[REDACTED]' : 'undefined');
  
  if (secret !== process.env.SCRAPING_KEY) {
    console.log('Authentication failed - Invalid SCRAPING_KEY');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { data: scrapedData, id } = (await request.json()) as {
    data: ScrapedData[];
    id: string;
  };
  console.log(`Received data for ID: ${id}, items count: ${scrapedData.length}`);

  try {
    await sql`UPDATE indexes SET content = ${{
      data: scrapedData,
    }} WHERE id = ${id}`;
    console.log('Successfully updated database');
  } catch (error) {
    console.error("Error storing scraped data:", error);
    return NextResponse.json(
      { error: "Error storing scraped data" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Data received" }, { status: 200 });
}

export async function GET(request: NextRequest) {
  console.log('GET /api/store/scraped-data - Starting request');
  const secret = request.headers.get("Authorization")?.split(" ")[1];
  console.log('Received secret:', secret ? '[REDACTED]' : 'undefined');
  
  if (secret !== process.env.UPSERT_KEY) {
    console.log('Authentication failed - Invalid UPSERT_KEY');
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const id = request.nextUrl.searchParams.get("id");
  console.log('Requested ID:', id);

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const [res] = (await sql`SELECT content FROM indexes WHERE id = ${id}`) as {
    content: {
      data: ScrapedData[];
    };
  }[];

  const output = res.content.data;
  console.log(`Retrieved ${output.length} items from database`);
  return NextResponse.json({ data: output }, { status: 200 });
}
