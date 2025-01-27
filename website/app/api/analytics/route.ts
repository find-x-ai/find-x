import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@/actions/auth";
import { sql } from "@/lib/db";

export const GET = async () => {
  const session = await getSession();

  if (!session || !session?.data) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  // fetch the data from the database
  const db_res =
    (await sql`SELECT logs.name, logs.index_id, logs.status, logs.query, logs.type FROM logs JOIN indexes ON logs.index_id = indexes.id where indexes.user_id = ${session.data.id}`) as {
      name: string;
      index_id: number;
      status: number;
      query: string;
      type: string;
    }[];

  //   console.log(db_res);
  if (!db_res || db_res.length === 0) {
    return NextResponse.json(
      {
        data: {
          normal: 0,
          cached: 0,
          successRate: 0,
          total: 0,
          error: 0,
        },
      },
      { status: 404 }
    );
  }
  return NextResponse.json(
    {
      data: {
        normal: db_res.filter((log) => log.type === "normal").length,
        cached: db_res.filter((log) => log.type === "cached").length,
        successRate: (
          (db_res.filter((log) => log.status == 200).length / db_res.length) *
          100
        ).toFixed(2),
        total: db_res.length,
        error: db_res.filter((log) => log.status !== 200).length,
      },
    },
    { status: 200 }
  );
};
