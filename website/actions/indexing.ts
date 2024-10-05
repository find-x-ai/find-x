"use server";
import { sql } from "@/lib/db";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

export const getIndexes = async () => {
  try {
    const { success, data } = await getSession();
    if (!success || !data) {
      return [];
    }
    const { id } = data;
    const indexes = await sql`select * from indexes where user_id = ${id}`;

    return indexes;
  } catch (error) {
    console.log(error);
    return [];
  }
};
