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
  try {
    const { url, indexId, email } = context.requestPayload as {
      url: string;
      indexId: string;
      email: string;
    };
    // Crawl whole website
    const response = await context.call<{
      totalLinks: number;
      status: "success" | "error";
    }>("crawling-website", {
      url: `${process.env.SCRAPING_URL}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        url: url,
        secret_key: process.env.SCRAPING_KEY || "",
        id: indexId,
        maxURLs: 500,
        store_url: process.env.STORE_URL || "",
      },
      retries: 3,
      timeout: "900s",
    });

    await context.run("check-crawl-response", async () => {
      if (
        response.body.status !== "success" ||
        response.body.totalLinks === 0
      ) {
        console.error("Invalid response from crawling-website");
        console.log(response);
        await sql`UPDATE indexes SET status = 'failed' WHERE id = ${indexId}`;
        throw new WorkflowAbort("Invalid response from crawling-website");
      } else {
        await sql`UPDATE indexes SET total_links = ${response.body.totalLinks} WHERE id = ${indexId}`;
      }
    });

    const { body } = await context.call<UpsertResponse>(
      "generate-embeddings",
      {
        url: `${process.env.UPSERT_URL}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          secret: process.env.UPSERT_KEY || "",
          client: indexId.toString(),
          store_url: process.env.STORE_URL || "",
        },
        timeout: "900s",
      } as any
    );

    await context.run("check-upsert-response", async () => {
      if (body?.status !== "success") {
        console.error("Invalid response from generate-embeddings");
        await sql`UPDATE indexes SET status = 'failed' WHERE id = ${indexId}`;
        throw new WorkflowAbort("Invalid response from generate-embeddings");
      } else {
        await sql`UPDATE indexes SET status = 'success' WHERE id = ${indexId}`;
        const creditExists =
          await sql`SELECT * FROM credits WHERE index_id = ${indexId}`;
        if (creditExists?.length === 0 || !creditExists) {
          await sql`INSERT INTO credits(index_id, total_requests, user_email) VALUES (${indexId}, 0, ${email})`;
        }
      }
    });
  } catch (error) {
    if (error instanceof WorkflowAbort) {
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw new WorkflowAbort("An unexpected error occurred");
    }
  }
});
