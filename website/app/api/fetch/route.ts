import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = (await request.json()) as {
    url: string;
  };
  try {
    const response = await fetch(data.url);
    const html = await response.text();
    return NextResponse.json({ status: true, page: html });
  } catch (error) {
    NextResponse.json({ status: false, error: error });
  }
}
