import { NextResponse, NextRequest } from "next/server";
import { sql } from "@/lib/db";
import { ScrapedData } from "@/types";
import { getSession } from "@/actions/auth";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("Authorization")?.split(" ")[1];
  if (secret !== process.env.SCRAPING_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: scrapedData, id } = (await request.json()) as {
    data: ScrapedData[];
    id: string;
  };

  try {
    await sql`UPDATE indexes SET content = ${{
      data: scrapedData,
    }} WHERE id = ${id}`;
  } catch (error) {
    console.error("Error storing scraped data", error);
    return NextResponse.json(
      { error: "Error storing scraped data" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Data received" }, { status: 200 });
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get("Authorization")?.split(" ")[1];
  if (secret !== process.env.UPSERT_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const [res] = (await sql`SELECT content FROM indexes WHERE id = ${id}`) as {
    content: {
      data: ScrapedData[];
    };
  }[];

  const output = res.content.data;
  return NextResponse.json({ data: output }, { status: 200 });
}
