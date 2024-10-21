import { useState, useCallback, useRef } from "react";
import { CrawlerProps, ScrapedData } from "@/types";

export const useCrawler = ({
  setLogMessages,
  setScrapedData,
  localMode,
  url,
}: CrawlerProps) => {
  const [scraping, setScraping] = useState<boolean>(false);
  const crawlingAbortControllerRef = useRef<AbortController | null>(null);

  const logMessage = useCallback(
    (message: string, tag: string, color: string) => {
      setLogMessages((prevMessages) => [
        ...prevMessages,
        { tag, message, color },
      ]);
    },
    [setLogMessages]
  );

  const getBaseUrl = (url: string) => {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  };

  const isInternalLink = (link: string, baseUrl: string) => {
    return link.startsWith("/") || link.startsWith(baseUrl);
  };

  const getFullUrl = (link: string, baseUrl: string) => {
    return link.startsWith("/") ? baseUrl + link : link;
  };

  const normalizeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.origin + urlObj.pathname.replace(/\/$/, "");
    } catch {
      return url;
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes} m, ${seconds % 60} s`;
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const crawlWebsite = async (url: string, signal: AbortSignal) => {
    const baseUrl = getBaseUrl(url);
    const internalQueue: string[] = [normalizeUrl(url)];
    const visited = new Set<string>();
    const scrapedData: ScrapedData[] = [];
    const batchSize = 10; // Reduced batch size for better concurrency control
    const requestDelay = 200; // Delay in milliseconds between requests

    while (internalQueue.length > 0) {
      if (signal.aborted) {
        throw new Error("Aborted");
      }

      const currentBatch = internalQueue.splice(0, batchSize);

      try {
        const results = await Promise.all(
          currentBatch.map(async (currentUrl) => {
            if (visited.has(currentUrl)) {
              return null;
            }

            logMessage(`Scraping: ${currentUrl}`, "[INFO]", "text-zinc-100");

            try {
              const response = await fetch(
                localMode
                  ? "http://localhost:8001/api/fetch"
                  : "https://sahilm416--scrape.modal.run",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    url: currentUrl,
                    secret_key: process.env.NEXT_PUBLIC_SCRAPING_KEY || "",
                  }),
                  signal: signal,
                }
              );

              if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
              }

              const result = await response.json();
              logMessage(
                `Successfully fetched ${currentUrl}`,
                "[SUCCESS]",
                "text-green-500"
              );

              const pageData = result.data ? result.data[0] : null;

              if (pageData) {
                visited.add(currentUrl); // Mark as visited immediately after successful fetch
                if (result.links) {
                  result.links.forEach((link: string) => {
                    if (isInternalLink(link, baseUrl)) {
                      const fullUrl = getFullUrl(link, baseUrl);
                      const normalizedFullUrl = normalizeUrl(fullUrl);
                      if (!visited.has(normalizedFullUrl) && !internalQueue.includes(normalizedFullUrl)) {
                        internalQueue.push(normalizedFullUrl);
                      }
                    }
                  });
                }
                return pageData;
              } else {
                logMessage(
                  `No data found for: ${currentUrl}`,
                  "[INFO]",
                  "text-zinc-100"
                );
                return null;
              }
            } catch (fetchError:any) {
              logMessage(
                `Error fetching ${currentUrl}: ${fetchError.message}`,
                "[ERROR]",
                "text-red-500"
              );
              return null;
            } finally {
              await delay(requestDelay); // Add delay between requests
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
          logMessage(`Crawling cancelled by user`, "[USER]", "text-red-500");
          return { scrapedData, totalLinks: visited.size };
        }
        logMessage(`Error scraping batch: ${error.message}`, "[ERROR]", "text-red-500");
      }
    }

    return { scrapedData, totalLinks: visited.size };
  };

  const startCrawler = useCallback(async () => {
    setScraping(true);
    setLogMessages([
      {
        tag: "[INFO]",
        message: "Starting crawling...",
        color: "text-zinc-100",
      },
    ]);
    setScrapedData([]);
    const startTime = Date.now();

    const controller = new AbortController();
    crawlingAbortControllerRef.current = controller;

    try {
      const { scrapedData, totalLinks } = await crawlWebsite(
        url,
        controller.signal
      );
      const endTime = Date.now();
      const timeTaken = formatTime(endTime - startTime);

      setScrapedData(scrapedData);
      logMessage(
        `Crawling finished. Total Links: ${totalLinks}. Time: ${timeTaken}`,
        "[FINISHED]",
        "text-white bg-[#ff371a] p-2 font-semibold"
      );
    } catch (error:any) {
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message === "Aborted")
      ) {
        logMessage(`Crawling cancelled by user`, "[USER]", "text-red-500");
      } else {
        console.error("Error crawling website:", error);
        logMessage(
          `Error crawling website: ${error.message}`,
          "[ERROR]",
          "text-red-500"
        );
      }
    } finally {
      setScraping(false);
      crawlingAbortControllerRef.current = null;
    }
  }, [url, localMode, setLogMessages, setScrapedData]);

  const cancelCrawling = useCallback(() => {
    if (crawlingAbortControllerRef.current) {
      crawlingAbortControllerRef.current.abort();
    }
  }, []);

  return { scraping, startCrawler, cancelCrawling };
};