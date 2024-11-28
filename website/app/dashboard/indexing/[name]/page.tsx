import { getSession } from "@/actions/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { Logger } from "../_components/logger";
import { Index } from "@/actions/types";
import { Header } from "../_components/header";
import { Key } from "../_components";

export const revalidate = 0;

const page = async ({ params }: { params: { name: string } }) => {
  const session = await getSession();
  if (!session || !session.data) {
    redirect("/login");
  }

  const index =
    (await sql`SELECT * FROM indexes WHERE name = ${params.name} and user_id = ${session.data.id}`) as Index[];
  if (!index || index.length === 0 || index[0].user_id !== session.data.id) {
    redirect("/dashboard/indexing");
  }

  return (
    <main className="flex flex-col">
      <Header index={index[0]} />
      <Logger id={index[0].id.toString()} />
      <Key api_key={index[0].api_key} />
    </main>
  );
};

export default page;
