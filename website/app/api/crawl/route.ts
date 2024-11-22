import { serve } from "@upstash/workflow/nextjs";
import { CrawlerService } from "./crawl-website";
import { EmbeddingsService } from "./embeddings";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const GET = async () => {
  return NextResponse.json({ message: "Hello World" });
};

export const POST = async (request: NextRequest) => {
  const { POST: handler } = serve(async (context) => {
    // const { url, indexId } = context.requestPayload;
    // if (!indexId) {
    //   console.error("Index ID is required");
    //   throw new Error("Index ID is required");
    // }
    // const crawlerService = new CrawlerService(indexId);
    
     await context.run(
      "crawl-website",
      async () => {
        console.log("crawling website...");
        console.log("Request Payload", context.requestPayload);
        // const { scrapedData, totalLinks } = await crawlerService.crawlWebsite(
        //   url
        // );

        // if (!scrapedData || scrapedData.length === 0) {
        //   await sql`update indexes set status = 'failed' where id = ${indexId}`;
        //   console.error("No data scraped");
        //   throw new Error("No data scraped");
        // }
        // await sql`update indexes set total_links = ${totalLinks} where id = ${indexId}`;
        // return { scrapedData, totalLinks };
      }
    );

    // const embeddingsService = new EmbeddingsService(indexId);
    await context.run("generate-embeddings", async () => {
      console.log("generating embeddings...");
      // const result = await embeddingsService.createNewWebsite(scrapedData);
      // if (result.success) {
      //   console.log(
      //     `successfully generated ${result.embeddedChunks?.length} embeddings for ${result.clientId}`
      //   );
      //   await sql`update indexes set status = 'success' where id = ${indexId}`;
      // } else {
      //   console.error("Failed to generate embeddings", result);
      //   await sql`update indexes set status = 'failed' where id = ${indexId}`;
      // }
      // return result;
    });
  });

  return await handler(request);
};
