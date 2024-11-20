import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.NEON_KEY!);

/*
Upstash Redis for authentication 
*/
import { Redis } from "@upstash/redis";
import { Index } from '@upstash/vector';
export const redis = Redis.fromEnv();
export const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});


