"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogMessage, ScrapedData } from "@/types";
import { useCrawler } from "@/hooks/useCrawler";
import { useEmbedding } from "@/hooks/useEmbedding";
import {
  Header,
  LogDisplay,
  ControlPanel,
  CustomDialog,
} from "@/components/new";
import Back from "@/components/ui/Back";
import { invoke } from "@tauri-apps/api/tauri";
import Loader from "@/components/Loader";

type InfoType = {
  id: string;
  name: string;
  url: string;
  plan: string;
  email: string;
  update: boolean;
};

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState<InfoType | null>(null);
  const [logMessages, setLogMessages] = useState<LogMessage[]>([]);
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);
  const [localMode, setLocalMode] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const { scraping, startCrawler, cancelCrawling } = useCrawler({
    setLogMessages,
    setScrapedData,
    localMode,
    url: data?.url ?? "",
  });

  const { isEmbedding, disableEmbedding, handleEmbedding, cancelEmbedding } =
    useEmbedding(data!, scrapedData, setLogMessages, router);

  useEffect(() => {
    async function fetchData() {
      try {
        const c = (await invoke("get_item", { key: "new" })) as string;
        const pageData: InfoType = JSON.parse(c);
        setData(pageData);
      } catch (error) {
        console.error("Error fetching page data:", error);
        setError(true);
      }
    }

    fetchData();
  }, []);

  const showResults = () => setIsDialogOpen(!isDialogOpen);

  if (!data) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Back />
        <div className="w-full h-full flex justify-center items-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <span className="text-xl text-red-700">Failed to get data!</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Back />
      <Header
        name={data.name}
        url={data.url}
        localMode={localMode}
        setLocalMode={setLocalMode}
      />
      <div className="flex flex-col p-5 h-full">
        <LogDisplay logs={logMessages} />
      </div>
      <ControlPanel
        scraping={scraping}
        isEmbedding={isEmbedding}
        disableEmbedding={disableEmbedding}
        scrapedData={scrapedData}
        startCrawler={startCrawler}
        showResults={showResults}
        handleEmbedding={handleEmbedding}
        cancelCrawling={cancelCrawling}
        cancelEmbedding={cancelEmbedding}
      />
      {isDialogOpen && (
        <CustomDialog onClose={showResults} scrapedData={scrapedData} />
      )}
    </div>
  );
}
