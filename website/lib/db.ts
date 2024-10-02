import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.NEON_KEY!);

/*
Upstash Redis for authentication 
*/
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();
