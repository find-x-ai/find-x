import { serve } from "@upstash/workflow/nextjs";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { redis } from "@/lib/db";

interface ScrapedImage {
  src: string;
  alt: string;
}

interface ScrapedPageData {
  url: string;
  title: string;
  content: string;
  summary: string;
  images: {
    data: ScrapedImage[];
  };
}

interface ScraperResponse {
  data: ScrapedPageData[];
  totalLinks: number;
}

type UpsertResponse = {
  status: "success" | "error";
  message: string;
};

export const GET = async () => {
  return NextResponse.json({ message: "Hello World" });
};

export const { POST } = serve(async (context) => {
  const { url, indexId, email } = context.requestPayload as {
    url: string;
    indexId: string;
    email: string;
  };
  // Crawl whole website
  const response = await context.call<ScraperResponse>("crawling-website", {
    url: `${process.env.SCRAPING_URL}`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      url: url,
      secret_key: process.env.SCRAPING_KEY || "",
      id: indexId,
      maxURLs: 500,
    },
  });
  // check if response isof type ScraperResponse
  if (
    response.status !== 200 ||
    !response.body ||
    !response.body.data ||
    response.body.data.length === 0
  ) {
    console.error("Invalid response from crawling-website");

    await sql`UPDATE indexes SET status = 'failed' WHERE id = ${indexId}`;

    await redis.lpush(
      `scraper_logs:${indexId}`,
      JSON.stringify({
        tag: "error",
        message: "Invalid response from crawling-website",
        timestamp: new Date().toISOString(),
      })
    );

    throw new Error("Invalid response from crawling-website");
  }

  await sql`UPDATE indexes SET total_links = ${response.body.totalLinks} WHERE id = ${indexId}`;

  await redis.lpush(
    `scraper_logs:${indexId}`,
    JSON.stringify({
      tag: "info",
      message: "Waiting for upserting...",
      timestamp: new Date().toISOString(),
    })
  );

  const { status, body } = await context.call<UpsertResponse>(
    "generate-embeddings",
    {
      url: `${process.env.UPSERT_URL}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        data: response.body.data,
        secret: process.env.UPSERT_KEY || "",
        client: indexId.toString(),
      },
    }
  );

  if (status !== 200 || !body || body.status !== "success") {
    console.error("Invalid response from generate-embeddings");
    await sql`UPDATE indexes SET status = 'failed' WHERE id = ${indexId}`;
    throw new Error("Invalid response from generate-embeddings");
  }
  // const plan = await sql`SELECT * FROM plans WHERE user_email = ${email}`;
  const creditExists =
    await sql`SELECT * FROM credits WHERE index_id = ${indexId}`;
  if (creditExists?.length === 0 || !creditExists) {
    await sql`INSERT INTO credits(index_id, total_requests, user_email) VALUES (${indexId}, 0, ${email})`;
  }
  await sql`UPDATE indexes SET status = 'success', content = ${response.body} WHERE id = ${indexId}`;
  return;
});
