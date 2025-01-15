import { serve } from "@upstash/workflow/nextjs";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { WorkflowAbort } from "@upstash/workflow";

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
  const { website, indexId, email } = context.requestPayload as {
    website: string;
    indexId: string;
    email: string;
  };

  // console.log(`Starting crawl process for URL: ${url}, IndexID: ${indexId}`);

  // Before crawling
  // console.log("Initiating website crawling...");
  const response = await context.call<{
    totalLinks: number;
    status: "success" | "error";
  }>("crawling-website", {
    url: `${process.env.SCRAPING_URL}`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      url: website,
      secret_key: process.env.SCRAPING_KEY || "",
      id: indexId,
      maxURLs: 500,
      store_url: process.env.STORE_URL || "",
    },
    retries: 0,
    timeout: "900s"
  });
  // console.log("Crawling completed. Response:", response.body);

  await context.run("check-crawl-response", async () => {
    if (response.body.status !== "success" || response.body.totalLinks === 0) {
      console.error("Crawl failed:", {
        status: response.body.status,
        totalLinks: response.body.totalLinks,
        indexId,
      });
      await sql`UPDATE indexes SET status = 'failed' WHERE id = ${indexId}`;
      throw new WorkflowAbort("Invalid response from crawling-website");
    }
    console.log(
      `Crawl successful. Total links found: ${response.body.totalLinks}`
    );
    await sql`UPDATE indexes SET total_links = ${response.body.totalLinks} WHERE id = ${indexId}`;
  });

  const { body } = await context.call<UpsertResponse>("generate-embeddings", {
    url: `${process.env.UPSERT_URL}`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      secret: process.env.UPSERT_KEY || "",
      client: indexId.toString(),
      store_url: process.env.STORE_URL || "",
    },
    retries: 0,
    timeout: "900s"
  });
  console.log("Embeddings generation response:", body);

  await context.run("check-upsert-response", async () => {
    if (body?.status !== "success") {
      console.error("Embeddings generation failed:", {
        status: body?.status,
        indexId,
      });
      await sql`UPDATE indexes SET status = 'failed' WHERE id = ${indexId}`;
      throw new WorkflowAbort("Invalid response from generate-embeddings");
    }

    console.log(`Embeddings generated successfully for index: ${indexId}`);
    await sql`UPDATE indexes SET status = 'success' WHERE id = ${indexId}`;

    const creditExists =
      await sql`SELECT * FROM credits WHERE index_id = ${indexId}`;
    console.log("Credit check result:", {
      exists: creditExists?.length > 0,
      indexId,
    });

    if (creditExists?.length === 0 || !creditExists) {
      console.log(
        `Creating new credits entry for index: ${indexId}, email: ${email}`
      );
      await sql`INSERT INTO credits(index_id, total_requests, user_email) VALUES (${indexId}, 0, ${email})`;
    }
  });
});
