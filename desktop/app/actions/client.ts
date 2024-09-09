import { db } from "@/lib/db";
import { Index } from "@upstash/vector";

export const deleteClient = async ({
  id,
  key,
}: {
  id: number;
  key: string;
}) => {
  try {
    await db(`DELETE FROM CLIENTS WHERE id = $1`, [id]);

    const index = new Index({
      url: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_URL!,
      token: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN!,
      cache: false,
    });
    await index.deleteNamespace(id.toString());
  } catch (error) {
    console.log(error);
  }
};
