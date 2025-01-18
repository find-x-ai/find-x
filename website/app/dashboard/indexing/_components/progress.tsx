import { useEffect, useState } from "react";
import { useIndex } from "@/context/index-context";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Database, ListOrdered } from "lucide-react";

export const Progress = () => {
  const { index, setIndex } = useIndex();
  const [processData, setProcessData] = useState<{
    queueLength: number;
    scrapedDataLength: number;
    visitedLength: number;
    percentage: number;
  }>({
    queueLength: 0,
    scrapedDataLength: 0,
    visitedLength: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchProcessData = async () => {
      setLoading(true);
      timeoutId = setInterval(async () => {
        try {
          const data = await fetch(
            `/api/progress?indexId=${index!.id.toString()}`
          );
          const json = (await data.json()) as {
            queueLength: number;
            scrapedDataLength: number;
            visitedLength: number;
            percentage: number;
          };
          setProcessData(json);
          if (json.percentage === 100) {
            clearInterval(timeoutId);

            setTimeout(() => {
              setIndex({ ...index!, status: "success" });
            }, 3000);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }, 5000);
    };
    fetchProcessData();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [index]);
  // convert to percentage

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full p-5"
    >
      <div className="border border-[#202020] bg-[#121212] transition-colors rounded-xl p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {processData.percentage === 100 ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Indexing Complete</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  {processData.percentage > 80
                    ? "Upserting Data"
                    : "Scraping Content"}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">
                {processData.scrapedDataLength} pages scraped
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">
                {processData.queueLength} in queue
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-full relative h-2 bg-[#202020] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${processData.percentage}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`absolute inset-y-0 left-0 bg-emerald-500`}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">
              {Math.round(processData.percentage) || 0}%
            </span>
            <span className="text-xs text-gray-500">
              {processData.visitedLength} URLs processed
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
