import { getSession } from "@/actions/auth";
import { sql } from "@/lib/db";
import { redirect } from "next/navigation";
import { Index } from "@/actions/types";
import { Screen } from "../_components";

export const revalidate = 0;

const page = async ({ params }: { params: { name: string } }) => {
  const session = await getSession();
  if (!session || !session.data) {
    redirect("/login");
  }

  // decode the name
  const name = decodeURIComponent(params.name);

  const indexes =
    (await sql`SELECT * FROM indexes WHERE name = ${name} and user_id = ${session.data.id}`) as Index[];
  if (
    !indexes ||
    indexes.length === 0 ||
    indexes[0].user_id !== session.data.id
  ) {
    redirect("/dashboard/indexing");
  }

  return (
    <main className="flex flex-col w-full h-full">
      <Screen index={indexes[0]} />
    </main>
  );
};

export default page;
