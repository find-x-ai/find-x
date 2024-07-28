import { ControlPanelProps } from "@/types";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";



export const ControlPanel = ({
  scraping,
  isEmbedding,
  disableEmbedding,
  scrapedData,
  startCrawler,
  showResults,
  handleEmbedding,
  cancelCrawling,
  cancelEmbedding,
}: ControlPanelProps) => (
  <div className="w-full px-5 pt-0 pb-5 flex justify-end items-center ">
    {scraping ? (
      <Button variant={"destructive"} className="bg-red-700" onClick={cancelCrawling}>
        Cancel
      </Button>
    ) : (
      <Button
        className="bg-[#ff371a] hover:bg-[#ff371a]/80"
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
        onClick={cancelEmbedding}
        variant={"destructive"}
        className="ml-2 w-[100px] bg-red-700"
      >
        Cancel
      </Button>
    ) : (
      <Button
        onClick={handleEmbedding}
        disabled={!scrapedData.length || disableEmbedding}
        className="ml-2 w-[100px] bg-transparent border border-[#ff371a] text-[#ff371a] hover:bg-amber-500/5"
      >
        {disableEmbedding ? (
          <Loader2 className="animate-spin" />
        ) : (
          " Embed data"
        )}
      </Button>
    )}
  </div>
);
