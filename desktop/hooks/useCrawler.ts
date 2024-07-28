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

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes} m, ${seconds % 60} s`;
  };

  const crawlWebsite = async (url: string, signal: AbortSignal) => {
    const baseUrl = getBaseUrl(url);
    const internalQueue: string[] = [url];
    const visited = new Set<string>();
    const scrapedData: ScrapedData[] = [];

    while (internalQueue.length > 0) {
      if (signal.aborted) {
        throw new Error("Aborted");
      }

      const currentUrl = internalQueue.shift() as string;
      const arr = currentUrl.split("#");

      if (
        visited.has(currentUrl) ||
        (visited.has(arr[0]) && !arr[0].endsWith("/"))
      ) {
        continue;
      }

      try {
        logMessage(`Scraping: ${currentUrl}`, "[INFO]", "text-zinc-100");

        const response = await fetch(
          localMode
            ? "http://localhost:8001/api/fetch"
            : "https://sahilm416--scrape.modal.run",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: currentUrl,
              secret_key: process.env.NEXT_PUBLIC_SCRAPING_KEY!,
            }),
            signal: signal,
          }
        );

        const result = await response.json();
        logMessage(
          `Successfully fetched ${currentUrl}`,
          "[SUCCESS]",
          "text-green-500"
        );

        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 1000);
          signal.addEventListener(
            "abort",
            () => {
              clearTimeout(timeout);
              resolve(undefined);
            },
            { once: true }
          );
        });

        if (signal.aborted) {
          throw new Error("Aborted");
        }

        const pageData = result.data[0];

        if (pageData) {
          scrapedData.push(pageData);

          result.links.forEach((link: string) => {
            if (isInternalLink(link, baseUrl)) {
              const fullUrl = getFullUrl(link, baseUrl);
              if (!visited.has(fullUrl)) {
                internalQueue.push(fullUrl);
              }
            }
          });

          visited.add(currentUrl);
        } else {
          logMessage(
            `No data found for: ${currentUrl}`,
            "[INFO]",
            "text-zinc-100"
          );
        }
      } catch (error) {
        if (
          error instanceof Error &&
          (error.name === "AbortError" || error.message === "Aborted")
        ) {
          logMessage(`Crawling cancelled by user`, "[USER]", "text-red-500");
          return { scrapedData, totalLinks: visited.size };
        }
        logMessage(
          `Error scraping page: ${currentUrl} - ${error}`,
          "[ERROR]",
          "text-red-500"
        );
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
      console.log(scrapedData);
      logMessage(
        `Crawling finished. Total Links: ${totalLinks}. Time: ${timeTaken}`,
        "[FINISHED]",
        "text-white bg-[#ff371a] p-2 font-semibold"
      );
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message === "Aborted")
      ) {
        logMessage(`Crawling cancelled by user`, "[USER]", "text-red-500");
      } else {
        console.error("Error crawling website:", error);
        logMessage(
          `Error crawling website: ${error}`,
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
