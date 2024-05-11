"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CustomDialog from "@/components/CustomDialog";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/db";
// import { useRouter } from "next/navigation";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { redis } from "@/lib/redis";
import Back from "@/components/ui/Back";
import { approveRequest } from "../actions/requests";

interface LogMessage {
  tag: string;
  message: string;
  color: string;
}

interface ScrapedData {
  [key: string]: any;
}

const LogDisplay = ({ logs }: { logs: LogMessage[] }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the latest log whenever logs change
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="w-[100%] h-1 flex-grow overflow-x-hidden overflow-y-scroll border border-zinc-900 rounded-xl bg-black text-white">
      <ul className="p-2">
        {logs.map((log, index) => (
          <li
            key={index}
            className={`flex justify-between items-center font-mono ${log.color}`}
          >
            <span className="w-[200px]">{log.tag}</span>
            <span className="w-full text-left">
              {log.message.length > 60
                ? `${log.message.slice(0, 60)}...`
                : log.message}
            </span>
          </li>
        ))}
      </ul>
      <div ref={logsEndRef} />
    </div>
  );
};

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scraping, setScraping] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<LogMessage[]>([]);
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);
  const [localMode, setLocalMode] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEmbedding, setIsEmbedding] = useState<boolean>(false);
  const [disableEmbedding, setDisableEmbedding] = useState<boolean>(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [crawlingAbortController, setCrawlingAbortController] =
    useState<AbortController | null>(null);

  const beepSound = new Audio("/beep.mp3");

  useEffect(() => {
    return () => {
      abortController?.abort(); // Abort the ongoing operation
    };
  }, [abortController]);

  const search = searchParams.get("data") as string;
  const data = search.split("*");

  const info = {
    name: data[0],
    url: data[1],
    plan: data[2],
    email: data[3],
    id: data[4],
  };

  const startCrawler = async () => {
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

    // Create a new AbortController instance
    const controller = new AbortController();
    setCrawlingAbortController(controller);

    try {
      const { scrapedData, totalLinks } = await crawlWebsite(
        data[1],
        controller.signal
      );
      const endTime = Date.now();
      const timeTaken = formatTime(endTime - startTime);

      setScrapedData(scrapedData);
      setLogMessages((prevMessages) => [
        ...prevMessages,
        {
          tag: "[FINISHED]",
          message: `Crawling finished. Total Links: ${totalLinks}. Time: ${timeTaken}`,
          color: "text-white bg-amber-600 p-2 font-semibold",
        },
      ]);
    } catch (error) {
      console.error("Error crawling website:", error);
      setLogMessages((prevMessages) => [
        ...prevMessages,
        {
          tag: "[ERROR]",
          message: `Error crawling website: ${error}`,
          color: "text-red-500",
        },
      ]);
    } finally {
      setScraping(false);
      setCrawlingAbortController(null); // Reset the AbortController instance
    }
  };
  const crawlWebsite = async (url: string, signal: AbortSignal) => {
    const baseUrl = getBaseUrl(url);
    const internalQueue: string[] = [url];
    const externalQueue: string[] = [];
    const visited = new Set<string>();
    const scrapedData: ScrapedData[] = [];
   
    while (internalQueue.length > 0) {
      const currentUrl = internalQueue.shift() as string;
      const arr = currentUrl.split("#");

      if (visited.has(currentUrl) || visited.has(arr[0]) && !arr[0].endsWith("/")) {
       
        continue;
      }
      try {
        logMessage(`Scraping: ${currentUrl}`, "[INFO]", "text-zinc-100");

        // Create a new AbortController for each fetch request
        const fetchController = new AbortController();
        signal.addEventListener("abort", () => fetchController.abort(), {
          once: true,
        });

        const response = await fetch(
          localMode
            ? "http://localhost:8001/api/fetch"
            : "https://sohel1807--scrape.modal.run",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: currentUrl }),
            signal: fetchController.signal, // Pass the AbortSignal to the fetch request
          }
        );

        signal.removeEventListener("abort", fetchController.abort);

        const result = await response.json();
        logMessage(
          `Successfully fetched ${currentUrl}`,
          "[SUCCESS]",
          "text-green-500"
        );

        await new Promise(resolve => setTimeout(resolve, 1000));

        const pageData = result.data[0];

        if (pageData) {
          scrapedData.push(pageData);

          result.links.forEach((link: string) => {
            // const arr = link.split("#");

            if (isInternalLink(link, baseUrl)) {
              const fullUrl = getFullUrl(link, baseUrl);
              if (!visited.has(fullUrl)) {
                internalQueue.push(fullUrl);
              }
            } else {
              externalQueue.push(link);
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
        //@ts-ignore
        if (error.name === "AbortError") {
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

  const logMessage = (message: string, tag: string, color: string) => {
    setLogMessages((prevMessages) => [
      ...prevMessages,
      { tag, message, color },
    ]);
  };

  const getBaseUrl = (url: string) => {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  };

  const isInternalLink = (link: string, baseUrl: string) => {
    return link.startsWith("/") || link.startsWith(baseUrl);
  };

  const getFullUrl = (link: string, baseUrl: string) => {
    if (link.startsWith("/")) {
      return baseUrl + link;
    }
    return link;
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes} m, ${seconds % 60} s`;
  };

  const showResults = () => {
    // Open a dialog box to display scraped data
    // console.log(scrapedData);
    setIsDialogOpen(!isDialogOpen);
  };

  const handleEmbedding = async () => {
    setIsEmbedding(true);
    logMessage(
      `Attention here , This cannot be undone !`,
      "[IMPORTANT]",
      "text-red-500"
    );

    // Create a new AbortController instance
    const controller = new AbortController();
    setAbortController(controller);
    //@ts-ignore
    const countDown = async (timeLeft) => {
      // Check if the embedding process has been canceled
      if (controller.signal.aborted) {
        logMessage(`Embedding cancelled by user`, "[USER]", "text-red-500");
        return; // Exit the function
      }
      beepSound.currentTime = 0; // Reset the sound to the beginning
      await beepSound.play();

      logMessage(
        `Embedding will start in ${
          timeLeft === 10 ? timeLeft : ("0" + timeLeft).slice(0, 2)
        } sec(s)`,
        "[WARNING]",
        "text-amber-500"
      );

      if (timeLeft > 0) {
        setTimeout(() => countDown(timeLeft - 1), 1000, controller.signal);
      } else {
        logMessage(`Embedding started...`, "[INFO]", "text-white");
        setIsEmbedding(false);
        setDisableEmbedding(true);
        try {
          // Chunk the scraped data
          const chunkSize = 5; // Set your chunk size here
          const chunks = [];
          for (let i = 0; i < scrapedData.length; i += chunkSize) {
            chunks.push(scrapedData.slice(i, i + chunkSize));
          }

          const key = uuidv4();

          const res = await db
            .from("clients")
            .insert([
              {
                url: info.url,
                name: info.name,
                plan: info.plan,
                key: key,
                email: info.email,
              },
            ])
            .select("id");

          console.log(res);
          //@ts-ignore
          const id = res.data[0].id as number;
          for (const chunk of chunks) {
            const res = await fetch("https://sohel1807--embed.modal.run/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                client: id,
                data: chunk,
              }),
            });

            if (res.ok) {
              logMessage(
                `Successfully generated vector embeddings for chunk`,
                "[SUCCESS]",
                "text-green-500"
              );
            } else {
              logMessage(
                `Error generating vector embeddings for chunk`,
                "[ERROR]",
                "text-red-500"
              );
            }
          }

          if (res) {
            logMessage(
              `Created client successfully`,
              "[success]",
              "text-green-500"
            );
            if (info.id) {
              await approveRequest(parseInt(info.id));
            }

            await redis.set(key, {
              id: id,
              name: info.name,
              email: info.email,
              plan: info.plan,
              remaining: parseInt(info.plan),
            });

            logMessage(
              `Created API key successfully`,
              "[success]",
              "text-green-500"
            );

    
            setTimeout(() => {
               router.push("/all");
            }, 1500);
          } else {
            logMessage(`Error creating client keys`, "[ERROR]", "text-red-500");
          }
        } catch (error) {
          console.log(error);
          logMessage(`Something went wrong`, "[ERROR]", "text-red-500");
        } finally {
          setDisableEmbedding(false);
        }
      }
    };

    countDown(10);
  };

  return (
    <div className=" w-full h-full flex flex-col">
      <Back />
      <div className="w-full flex justify-between bg-black px-5 pt-5">
        <h2 className="text-3xl w-full font-semibold text-white">{data[0]}</h2>
        <div className="flex w-full justify-between items-center">
          <h4 className="text-white">{data[1]}</h4>
          <div className="flex items-center space-x-2">
            <Switch
              className=" border"
              onCheckedChange={(e) => {
                setLocalMode(e);
              }}
              id="local-mode"
            />
            <Label htmlFor="local-mode" className="text-white">
              Local Mode
            </Label>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-5 h-full">
        <LogDisplay logs={logMessages} />
      </div>

      <div className="w-full px-5 pt-0 pb-5 flex justify-end items-center ">
        {scraping ? (
          <Button
            variant={"destructive"}
            onClick={async () => {
              crawlingAbortController?.abort();
            }}
          >
            Cancel
          </Button>
        ) : (
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={startCrawler}
            disabled={scraping || isEmbedding || disableEmbedding}
          >
            Start crawling
          </Button>
        )}
        <Button
          variant={"outline"}
          className="ml-2"
          onClick={showResults}
          disabled={!scrapedData.length || isEmbedding || disableEmbedding}
        >
          Show Results
        </Button>
        {isEmbedding ? (
          <Button
            onClick={() => {
              setIsEmbedding(false);
              abortController?.abort(); // Abort the ongoing operation
            }}
            variant={"destructive"}
            className="ml-2 w-[100px]"
          >
            Cancel
          </Button>
        ) : (
          <Button
            onClick={handleEmbedding}
            disabled={!scrapedData.length || disableEmbedding}
            className="ml-2 w-[100px] bg-amber-500/10 border border-amber-500 text-amber-500 hover:bg-amber-500/5"
          >
            {disableEmbedding ? (
              <Loader2 className="animate-spin" />
            ) : (
              " Embed data"
            )}
          </Button>
        )}
      </div>
      {isDialogOpen && (
        <CustomDialog onClose={showResults} scrapedData={scrapedData} />
      )}
    </div>
  );
}
