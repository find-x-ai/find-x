import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/db";
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

    const parsedLogs = logs.map((log) => {
      try {
        const jsonString = log.replace(/'/g, '"');
        return JSON.parse(jsonString) as Log;
      } catch (parseError) {
        return {
          tag: "error",
          message: `Failed to parse log entry: ${log}`,
          timestamp: new Date().toISOString(),
        } as Log;
      }
    });

    return NextResponse.json({ logs: parsedLogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
