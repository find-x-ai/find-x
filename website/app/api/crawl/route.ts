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

export const GET = async () => {
  return NextResponse.json({ message: "Hello World" });
};

export const { POST } = serve(async (context) => {
  const { url, indexId } = context.requestPayload as {
    url: string;
    indexId: string;
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
    },
  });

  console.log(response);

  // check if response isof type ScraperResponse
  if (response.status !== 200) {
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

  const { status } = await context.call("generate-embeddings", {
    url: `${process.env.UPSERT_URL}`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      data: response.body.data,
      secret: process.env.UPSERT_KEY || "",
      client: indexId.toString(),
    },
  });

  if (status !== 200) {
    console.error("Invalid response from generate-embeddings");
    await sql`UPDATE indexes SET status = 'failed' WHERE id = ${indexId}`;
    throw new Error("Invalid response from generate-embeddings");
  }

  await sql`UPDATE indexes SET status = 'success' WHERE id = ${indexId}`;
});
