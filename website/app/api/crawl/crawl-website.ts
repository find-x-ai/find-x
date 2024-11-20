import { Redis } from '@upstash/redis'
import { ScrapedData, LogMessage } from '@/types'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export class CrawlerService {
  private sessionId: string;
  
  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  private async logMessage(message: string, tag: string, color: string) {
    const logMessage: LogMessage = { tag, message, color };
    await redis.lpush(`logs:${this.sessionId}`, JSON.stringify(logMessage));
  }

  private getBaseUrl(url: string) {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  }

  private isInternalLink(link: string, baseUrl: string) {
    return link.startsWith("/") || link.startsWith(baseUrl);
  }

  private getFullUrl(link: string, baseUrl: string) {
    return link.startsWith("/") ? baseUrl + link : link;
  }

  private normalizeUrl(url: string) {
    try {
      const urlObj = new URL(url);
      return urlObj.origin + urlObj.pathname.replace(/\/$/, "");
    } catch {
      return url;
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async crawlWebsite(url: string, signal?: AbortSignal) {
    const baseUrl = this.getBaseUrl(url);
    const internalQueue: string[] = [this.normalizeUrl(url)];
    const visited = new Set<string>();
    const scrapedData: ScrapedData[] = [];
    const batchSize = 10; // Reduced batch size for better concurrency control
    const requestDelay = 200; // Delay in milliseconds between requests

    while (internalQueue.length > 0) {
      if (signal?.aborted) {
        throw new Error("Aborted");
      }

      const currentBatch = internalQueue.splice(0, batchSize);

      try {
        const results = await Promise.all(
          currentBatch.map(async (currentUrl) => {
            if (visited.has(currentUrl)) {
              return null;
            }

            await this.logMessage(`Scraping: ${currentUrl}`, "[INFO]", "text-zinc-100");

            try {
              const response = await fetch(
                `${process.env.SCRAPING_URL}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    url: currentUrl,
                    secret_key: process.env.SCRAPING_KEY || "",
                  }),
                  signal: signal,
                }
              );
              if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
              }

              const result = await response.json();
              await this.logMessage(
                `Successfully fetched ${currentUrl}`,
                "[SUCCESS]",
                "text-green-500"
              );

              const pageData = result.data ? result.data[0] : null;

              if (pageData) {
                visited.add(currentUrl); // Mark as visited immediately after successful fetch
                if (result.links) {
                  result.links.forEach((link: string) => {
                    if (this.isInternalLink(link, baseUrl)) {
                      const fullUrl = this.getFullUrl(link, baseUrl);
                      const normalizedFullUrl = this.normalizeUrl(fullUrl);
                      if (!visited.has(normalizedFullUrl) && !internalQueue.includes(normalizedFullUrl)) {
                        internalQueue.push(normalizedFullUrl);
                      }
                    }
                  });
                }
                return pageData;
              } else {
                await this.logMessage(
                  `No data found for: ${currentUrl}`,
                  "[INFO]",
                  "text-zinc-100"
                );
                return null;
              }
            } catch (fetchError:any) {
              await this.logMessage(
                `Error fetching ${currentUrl}: ${fetchError.message}`,
                "[ERROR]",
                "text-red-500"
              );
              return null;
            } finally {
              await this.delay(requestDelay); // Add delay between requests
            }
          })
        );

        scrapedData.push(
          ...(results.filter((data) => data !== null) as ScrapedData[])
        );
      } catch (error:any) {
        console.log(error);
        if (
          error instanceof Error &&
          (error.name === "AbortError" || error.message === "Aborted")
        ) {
          await this.logMessage(`Crawling cancelled by user`, "[USER]", "text-red-500");
          return { scrapedData, totalLinks: visited.size };
        }
        await this.logMessage(`Error scraping batch: ${error.message}`, "[ERROR]", "text-red-500");
      }
    }

    return { scrapedData, totalLinks: visited.size };
  }
}