"use server";
import { sql } from "@/lib/db";
import { getSession } from "./auth";
import { nanoid } from "nanoid";
import { Index } from "./types/index";

export const getIndexes = async (): Promise<Index[]> => {
  try {
    const { success, data } = await getSession();
    if (!success || !data) {
      return [];
    }
    const { id } = data;
    const indexes =
      (await sql`select * from indexes where user_id = ${id}`) as Index[];
    return indexes;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createIndex = async (name: string, url: string): Promise<{ success: boolean; message: string; id: string | null }> => {
  const { success, data } = await getSession();
  if (!success || !data) {
    return { success: false, message: "Unauthorized", id: null };
  }
  try {
    const { id } = data;
    // const checkAlreadyExists =
    //   await sql`select * from indexes where url = ${url} and user_id = ${id}`;
    // if (checkAlreadyExists.length > 0) {
    //   return { success: false, message: "Index already exists" };
    // }
    const apiKey =
      "fx_" +
      nanoid(16) +
      "-" +
      nanoid(16) +
      "-" +
      nanoid(16) +
      "-" +
      nanoid(16);
    const [newIndex] = await sql`
      insert into indexes (name, url, user_id, total_links, api_key, last_deploy, status) 
      values (${name}, ${url}, ${id}, 0, ${apiKey}, now(), 'deploying') 
      returning *` as Index[];

    if (!newIndex) {
      console.error("Failed to create index");
      return { success: false, message: "Something went wrong!", id: null };
    }

    const res = await fetch(
      `${process.env.UPSTASH_WORKFLOW_URL}/api/crawl`,
      {
        method: "POST",
        body: JSON.stringify({ url, indexId: newIndex.id }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, message: "Index created successfully", id: newIndex.id.toString() };
  } catch (error) {
    console.error("Failed to create index", error);
    return { success: false, message: "Something went wrong!", id: null };
  }
};
