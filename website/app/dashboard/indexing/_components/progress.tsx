import { useEffect, useState } from "react";

export const Progress = ({ indexId }: { indexId: string }) => {
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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const fetchProcessData = async () => {
      timeoutId = setInterval(async () => {
        try {
          const data = await fetch(`/api/progress?indexId=${indexId}`);
          const json = (await data.json()) as {
            queueLength: number;
            scrapedDataLength: number;
            visitedLength: number;
            percentage: number;
          };
          setProcessData(json);
          if (json.percentage === 100) {
            clearInterval(timeoutId);
          }
        } catch (error) {
          console.error(error);
        }
      }, 5000);
    };
    fetchProcessData();
    return () => {
      clearTimeout(timeoutId);
    };
  }, [indexId]);
  // convert to percentage

  return <div>{JSON.stringify(processData)}</div>;
};
