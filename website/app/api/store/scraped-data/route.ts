import { NextResponse, NextRequest } from "next/server";
import { sql } from "@/lib/db";
import { ScrapedData } from "@/types";
import { getSession } from "@/actions/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.data) {
    console.error("Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, id } = (await request.json()) as {
    data: ScrapedData[];
    id: string;
  };

  try {
    await sql`UPDATE indexes SET content = ${data} WHERE id = ${id} AND user_id = ${session.data.id}`;
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
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const data = await sql`SELECT content FROM indexes WHERE id = ${id}`;
  return NextResponse.json(data, { status: 200 });
}
