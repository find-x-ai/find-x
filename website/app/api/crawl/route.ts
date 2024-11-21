import { serve } from "@upstash/workflow/nextjs";
import { CrawlerService } from "./crawl-website";
import { EmbeddingsService } from "./embeddings";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const GET = async () => {
  return NextResponse.json({ message: "Hello World" });
};

export const POST = async (request: NextRequest) => {
  // get url from query params
  const url = request.nextUrl.searchParams.get("url") as string;
  const indexId = request.nextUrl.searchParams.get("indexId") as string;
  const { POST: handler } = serve(async (context) => {
    if (!indexId) {
      console.error("Index ID is required");
      throw new Error("Index ID is required");
    }
    const crawlerService = new CrawlerService(indexId);

    const { scrapedData, totalLinks } = await context.run(
      "crawl-website",
      async () => {
        console.log("crawling website...");
        const { scrapedData, totalLinks } = await crawlerService.crawlWebsite(
          url
        );

        if (!scrapedData || scrapedData.length === 0) {
          await sql`update indexes set status = 'failed' where id = ${indexId}`;
          console.error("No data scraped");
          throw new Error("No data scraped");
        }
        await sql`update indexes set total_links = ${totalLinks} where id = ${indexId}`;
        return { scrapedData, totalLinks };
      }
    );

    const embeddingsService = new EmbeddingsService(indexId);
    const res = await context.run("generate-embeddings", async () => {
      const result = await embeddingsService.createNewWebsite(scrapedData);
      if (result.success) {
        console.log(
          `successfully generated ${result.embeddedChunks?.length} embeddings for ${result.clientId}`
        );
        await sql`update indexes set status = 'success' where id = ${indexId}`;
      } else {
        console.error("Failed to generate embeddings", result);
        await sql`update indexes set status = 'failed' where id = ${indexId}`;
      }
      return result;
    });
  });

  return await handler(request);
};
