"use server";
import { db } from "@/lib/db";

export const requestUsage = async ({
  name,
  email,
  url,
}: {
  name: string;
  url: string;
  email: string;
}) => {
  try {
    const checkAlreadyExists = (await db(
      `SELECT * FROM requests WHERE email = $1 and url = $2 and name = $3 and status = $4`,
      [email, url, name, "waiting"]
    )) as [{}];

    if (checkAlreadyExists.length > 0) {
      return {
        success: false,
        message: "Already in the queue",
      };
    }
    await db(
      `INSERT INTO requests(name,email,url,status,plan) VALUES ($1,$2,$3,$4,$5)`,
      [name, email, url, "waiting", 10]
    );

    const res = await checkUrl({ url: url });
    if (!res.success) {
      return {
        success: res.success,
        message: res.message,
      };
    }

    return {
      success: true,
      message: "Successfully sent request",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to send request!",
    };
  }
};

export const checkUrl = async ({ url }: { url: string }) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      return {
        success: true,
        message: "Successfully sent request",
      };
    } else {
      return {
        success: false,
        message: "Invalid URL!",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Invalid URL!",
    };
  }
};
