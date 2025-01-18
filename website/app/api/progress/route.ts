import { NextRequest, NextResponse } from "next/server";
import { redis, sql } from "@/lib/db";

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
  const dbRes = await sql`select status from indexes where id = ${indexId}`;
  const status = dbRes[0]?.status;
  if (!processData) {
    return NextResponse.json({
      queueLength: 0,
      scrapedDataLength: 0,
      visitedLength: 0,
      status: status,
    });
  }
  return NextResponse.json(processData);
};
