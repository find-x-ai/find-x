import { neon } from "@neondatabase/serverless";

const conn = neon(process.env.NEXT_PUBLIC_DB_SECRET!);

export const db = conn;
