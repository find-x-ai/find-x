import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/db";

export const GET = async (req: NextRequest) => {
  const indexId = req.nextUrl.searchParams.get("indexId");
  if (!indexId) {
    return NextResponse.json({
      error: "Index ID is required",
    });
  }
  const processData = (await redis.get(`process_${indexId}`)) as {
    queueLength: number;
    scrapedDataLength: number;
    visitedLength: number;
  };
  console.log(processData);
  if (!processData) {
    return NextResponse.json({
      queueLength: 0,
      scrapedDataLength: 0,
      visitedLength: 0,
    });
  }
  return NextResponse.json(processData);
};
