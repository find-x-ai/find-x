import { Index } from "@upstash/vector";

export const index = new Index({
  url: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN!,
  cache: false,
});
