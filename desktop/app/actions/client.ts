import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { Index } from "@upstash/vector";

export const deleteClient = async ({
  id,
  key,
}: {
  id: number;
  key: string;
}) => {
  const res = await db.from("clients").delete().eq("id", id);

  await redis.del(key);

  const index = new Index({
    url: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_URL!,
    token: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN!,
    cache: false,
  });
  await index.deleteNamespace(id.toString());
};
