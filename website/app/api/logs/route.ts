import { NextRequest, NextResponse } from "next/server";
import { redis, sql } from "@/lib/db";
import { getSession } from "@/actions/auth";

type Log = {
  tag: string;
  message: string;
  timestamp: string;
};

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    const logs = (await redis.lrange(`process_logs:${id}`, 0, -1)) as string[];
    const index = await sql`SELECT * FROM indexes WHERE id = ${id}`;
    if (!index || index.length === 0 || index[0].user_id !== session.data.id) {
      return NextResponse.json(
        { error: "Failed to find index" },
        { status: 404 }
      );
    }
    const isOver = index[0].status != "deploying";
    // const parsedLogs = logs.map((log) => {
    //   try {
    //     const jsonString = log.replace(/'/g, '"');
    //     return JSON.parse(jsonString) as Log;
    //   } catch (parseError) {
    //     return {
    //       tag: "error",
    //       message: `Failed to parse log entry: ${log}`,
    //       timestamp: new Date().toISOString(),
    //     } as Log;
    //   }
    // });

    // return NextResponse.json({
    //   logs: parsedLogs.reverse(),
    //   isOver,
    //   status: index[0].status,
    // });
    console.log("logs", logs.length);
    return NextResponse.json({
      logs: logs.reverse(),
      isOver,
      status: index[0].status,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
