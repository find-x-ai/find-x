"use server";
import { index, redis, sql } from "@/lib/db";
import { getSession } from "./auth";
import { nanoid } from "nanoid";
import { Index } from "./types/index";
import { revalidatePath } from "next/cache";

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

export const createIndex = async (
  name: string,
  url: string,
  timeNow: Date
): Promise<{ success: boolean; message: string; name: string | null }> => {
  try {
    const { success, data } = await getSession();
    if (!success || !data) {
      return { success: false, message: "Unauthorized", name: null };
    }

    // Extract main domain from URL
    let mainUrl: string;
    try {
      const urlObject = new URL(url);
      mainUrl =
        urlObject.protocol + "//" + urlObject.hostname.replace("www.", "");
      mainUrl = mainUrl.endsWith("/") ? mainUrl : mainUrl + "/";
    } catch (error) {
      return { success: false, message: "Invalid URL format", name: null };
    }

    const { id } = data;
    // Modified query to compare with main URL
    const checkAlreadyExists = await sql`
      select * from indexes 
      where (url = ${mainUrl} OR name = ${name}) 
      and user_id = ${id}`;
    if (checkAlreadyExists.length > 0) {
      const duplicateField =
        checkAlreadyExists[0].url === mainUrl ? "URL" : "name";
      return {
        success: false,
        message: `Index with this ${duplicateField} already exists`,
        name: null,
      };
    }
    const apiKey = "fx_" + nanoid(16) + "-" + nanoid(16);
    const [newIndex] = (await sql`
      insert into indexes (name, url, user_id, api_key, last_deploy, status) 
      values (${name}, ${mainUrl}, ${id}, ${apiKey}, ${timeNow}, 'deploying') 
      returning *`) as Index[];

    if (!newIndex) {
      console.error("Failed to create index");
      return { success: false, message: "Something went wrong!", name: null };
    }
    try {
      fetch(`${process.env.SERVER_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          id: newIndex.id,
          max_url: 1000,
          scrape_api: process.env.SCRAPE_URL,
          upsert_api: process.env.UPSERT_URL,
          secret_key: process.env.SERVER_SECRET,
        }),
      });
    } catch (error) {
      console.error("Failed to create index", error);
      await sql`UPDATE indexes SET status = 'failed' WHERE id = ${newIndex.id}`;
      return { success: false, message: "Something went wrong!", name: null };
    }

    revalidatePath("/dashboard/indexing");
    return {
      success: true,
      message: "Index created successfully",
      name: newIndex.name,
    };
  } catch (error) {
    console.error("Failed to create index", error);
    return { success: false, message: "Something went wrong!", name: null };
  }
};

export const getIndex = async (id: string) => {
  const session = await getSession();
  if (!session || !session.data) {
    return { success: false, message: "Unauthorized", data: null };
  }
  try {
    const res =
      (await sql`select * from indexes where id=${id} and user_id=${session.data.id}`) as Index[];
    return {
      success: true,
      message: "Successfully fetched",
      data: res[0],
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "something went wrong",
      data: null,
    };
  }
};

export const redeploy = async (
  id: string,
  url: string,
  tag: "override" | "new"
) => {
  const session = await getSession();
  if (!session || !session.data) {
    return { success: false, message: "Unauthorized" };
  }
  try {
    await redis.del(`process_logs:${id}`);
    await sql`UPDATE indexes SET status = 'deploying' WHERE id = ${id} and user_id = ${session.data.id}`;
    tag === "new" && (await index.deleteNamespace(id));
    fetch(`${process.env.SERVER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        id,
        max_url: 1000,
        scrape_api: process.env.SCRAPE_URL,
        upsert_api: process.env.UPSERT_URL,
        secret_key: process.env.SERVER_SECRET,
      }),
    });
    return { success: true, message: "Deployement started" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to deploy" };
  }
};

export const deleteIndex = async (id: string) => {
  const session = await getSession();
  if (!session || !session.data) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // First delete from database
    const res =
      (await sql`select * from indexes where id = ${id} and user_id = ${session.data.id}`) as Index[];
    await sql`DELETE FROM credits WHERE index_id = ${id} and user_email = ${session.data.email}`;
    await sql`DELETE FROM indexes where id = ${id} and user_id = ${session.data.id} and user_id = ${session.data.id}`;

    const deleteIds = res[0].content.data.map((item) => `${id}-${item.url}`);
    await index.delete(deleteIds);
    return { success: true, message: "Deleted index" };
  } catch (error) {
    console.error("Failed to delete index:", error);
    return { success: false, message: "Failed to delete index" };
  }
};
