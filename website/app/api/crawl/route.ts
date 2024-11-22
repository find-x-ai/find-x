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
  if (!indexId) {
    console.error("Index ID is required");
    throw new Error("Index ID is required");
  }
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

  // check if response isof type ScraperResponse
  if (!response || typeof response !== "object" || !("data" in response)) {
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
  // Generate embeddings

  console.log(response);
});
