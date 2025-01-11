import { useEffect, useState } from "react";
import { useIndex } from "@/context/index-context";
import { motion } from "framer-motion";
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
      <div className="border border-[#202020] rounded-lg p-5 flex flex-col gap-5">
        <div className="flex gap-2 items-center">
          <p className="text-sm text-gray-500">
            {processData.percentage > 80
              ? processData.percentage === 100
                ? "Success"
                : "Upserting..."
              : "Scraping..."}
          </p>
        </div>
        <div className="w-full relative h-2 bg-[#202020] rounded-full">
          <span
            className={`w-full h-full bg-emerald-400/50 border border-emerald-400 rounded-full absolute transition-all duration-300 ease-in-out top-0 left-0`}
            style={{ width: `${processData.percentage}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};
