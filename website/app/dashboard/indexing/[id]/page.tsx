import { getSession } from "@/actions/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { Logger } from "../_components/logger";
const page = async ({ params }: { params: { id: string } }) => {
  const session = await getSession();
  if (!session || !session.data) {
    redirect("/login");
  }

  const index = await sql`SELECT * FROM indexes WHERE id = ${params.id}`;
  if (!index || index.length === 0 || index[0].user_id !== session.data.id) {
    redirect("/dashboard/indexing");
  }

  return <Logger id={params.id} />;
};

export default page;
