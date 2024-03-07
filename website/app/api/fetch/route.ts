import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(request: Request) {
  const data = (await request.json()) as {
    url: string;
  };
  try {
    const response = await axios.get(data.url);
    return NextResponse.json({ status: true, page: response.data });
  } catch (error) {
    NextResponse.json({ status: false, error: error });
  }
}
