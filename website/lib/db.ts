"use server";
import { neon } from "@neondatabase/serverless";
export const db = neon(process.env.NEON_KEY!);