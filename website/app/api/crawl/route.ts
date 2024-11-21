import { serve } from "@upstash/workflow/nextjs";
import { CrawlerService } from "./crawl-website";
import { EmbeddingsService } from "./embeddings";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const GET = async () => {
  return NextResponse.json({ message: "Hello World" });
};

export const { POST } = serve<{ url: string; indexId: string }>(
  async (context) => {
    const { url, indexId } = context.requestPayload;
    if (!indexId) {
      console.error("Index ID is required");
      throw new Error("Index ID is required");
    }
    const sessionId = nanoid();
    const crawlerService = new CrawlerService(sessionId);
    /**
     * crawl whole website by depth first search
     */
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

    /**
     * generate vector embeddings for each chunk
     */
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
  }
);
