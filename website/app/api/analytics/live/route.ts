import { sql } from "@/lib/db";
import { getSession } from "@/actions/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getSession();
  if (!session || !session?.data) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const db_res =
    (await sql`select logs.id, logs.name, logs.index_id, logs.status, logs.query, logs.type from logs JOIN indexes ON logs.index_id = indexes.id where indexes.user_id = ${session.data.id} order by logs.id desc limit 5`) as {
      id: number;
      name: string;
      index_id: number;
      status: number;
      query: string;
      type: string;
    }[];

  if (!db_res || db_res.length === 0) {
    return NextResponse.json({ message: "No data found" }, { status: 404 });
  }

  return NextResponse.json({ data: db_res }, { status: 200 });
};
