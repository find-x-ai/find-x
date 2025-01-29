import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/actions/auth";
import { sql } from "@/lib/db";

export const GET = async () => {
  const session = await getSession();
  if (!session || !session.data) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 400,
      }
    );
  }

  const res = await sql`
  SELECT l.*
  FROM logs l
  JOIN indexes i ON l.index_id = i.id
  WHERE i.user_id = ${session.data.id}
  AND l.type <> 'cached'
  AND l.time >= DATE_TRUNC('month', NOW())  -- First day of the current month
  AND l.time < NOW();  -- Up to the current timestamp
`;

  const plan_res =
    await sql`select * from plans where user_email = ${session.data.email}`;

  if (!plan_res || plan_res.length === 0) {
    return NextResponse.json({
      message: "failed to get plan information",
    });
  }

  //   console.log(plan_res);

  return NextResponse.json({
    message: "Successfully fetched billing",
    count: res.length,
    plan: plan_res[0],
  });
};
