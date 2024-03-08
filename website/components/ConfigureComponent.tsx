"use client";
import React, { useState } from "react";
import cheerio from "cheerio";
import { getEnvironmentUrl } from "@/actions/env";
import { toast } from "sonner";
export default function ConfigureComponent() {
  const [url, setUrl] = useState("");
  const [logs, setLogs] = useState([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLogs, setShowLogs] = useState<boolean>(false);
  const getClientData = async (startUrl: string) => {
    const startTime = new Date();
    const queue = [startUrl];
    const visitedUrls = new Set();
    const pageData = [];
    const { origin } = new URL(startUrl); // Get the origin of the starting URL

    while (queue.length > 0) {
      const url = queue.shift();
      if (!url) continue;
      try {
        if (!visitedUrls.has(url)) {
          visitedUrls.add(url);
          const fetchUrl = (await getEnvironmentUrl()) as string;
          const res = await fetch(fetchUrl, {
            method: "POST",
            body: JSON.stringify({
              url: url,
            }),
          });
          const response = await res.json();

          if (response.status) {
            const $ = cheerio.load(response.page);
            // Remove script tags and script-related content
            $("script").remove();
            $("[src]").remove(); // Remove elements with src attributes (possibly scripts)
            $("[onclick]").remove(); // Remove elements with onclick attributes (potentially script-related)
            // Extract text from remaining HTML
            const text = $("body").text().trim();

            // Check if the URL already exists in pageData
            const existingIndex = pageData.findIndex(
              (item) => item.url === url
            );
            if (existingIndex !== -1) {
              // Update content if the URL already exists
              pageData[existingIndex].content = text;
            } else {
              // Push new data if the URL is not found
              pageData.push({ url: url, content: text });
            }

            setLogs((prevLogs) => [
              ...prevLogs,
              `Fetching content for URL: ${url}`,
            ]);

            $("a").each((index, element) => {
              const link = $(element).attr("href");
              if (link) {
                const absoluteUrl = new URL(link, url).href;
                // Check if the absolute URL belongs to the same domain as the origin
                if (
                  absoluteUrl.startsWith(origin) &&
                  !visitedUrls.has(absoluteUrl)
                ) {
                  queue.push(absoluteUrl);
                }
              }
            });
          } else {
            setLogs((prevLogs) => [
              ...prevLogs,
              `Failed to fetch content for URL: ${url}, status : ${response.status}`,
            ]);
          }
        }
      } catch (error: any) {
        setLogs((prevLogs) => [
          ...prevLogs,
          `Failed to fetch content for URL: ${url}, error: ${error.message}`,
        ]);
      }
    }
    setLogs((prevLogs) => [...prevLogs, `✅ sccessfully configured data of ${pageData.length} pages`]);
    console.log(pageData);
    const endTime = new Date();
    const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;

    setLogs((prevLogs) => [...prevLogs, `⌚ Total time taken : ${elapsedTime} seconds`]);

    return { pageData, elapsedTime, numLinksScraped: visitedUrls.size };
  };

  const handleStart = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    try {
      setLogs([""]);
      setLoading(true);
      setShowLogs(true);
      await getClientData(url);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-100px)] px-6 pt-4 flex flex-col justify-center items-center">
      <div className="w-full h-full max-w-[1200px] border border-[#222222] flex flex-col gap-5 p-5">
        <h1 className="text-3xl text-white pt-5">Configure your site</h1>
        <div className="flex sm:flex-row flex-col gap-5">
          <input
            onChange={(e) => setUrl(e.target.value)}
            className="w-full font-sans sm:max-w-[400px] h-[40px] border border-purple-950/30 bg-purple-950/30 text-white px-3 rounded-sm"
            type="text"
            placeholder="enter site url"
          />
          <button
            disabled={loading}
            onClick={handleStart}
            className="sm:w-[200px] w-full h-[40px] text-white border border-purple-950/30 bg-purple-500 rounded-sm"
          >
            {loading ? "loading" : "start"}
          </button>
        </div>
        <p className="text-zinc-400 text-sm">
          This could take variable time to complete depending on your site, sit
          back and let it complete...⏳ <br />
          don't close or refresh the browser window it'll immediately halt the process.
        </p>
        <div className={`w-full overflow-hidden h-80 text-[#ffffff] border-purple-950/30 bg-black/20 rounded-md ${showLogs ? "block" : "hidden"}`}>
          <div className="overflow-y-auto max-h-80 mb-5 overflow-x-auto">
            {logs.map((log, index) => (
              <p className={`font-mono px-2 ${log.includes("Failed") ? "text-red-600" : "text-green-600"}`} key={index}>
                {log}
              </p>
            ))}
            <div
              ref={(el) => {
                el && el.scrollIntoView({ behavior: "smooth" });
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
