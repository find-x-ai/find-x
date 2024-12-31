import { Loader } from "@/components/ui/loader";
import { ChevronRight, CircleCheckBig } from "lucide-react";
import React, {
  useEffect,
  useState,
  useRef,
  SetStateAction,
  useMemo,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import { Index } from "@/actions/types";
import { format } from "date-fns";

type LogType = "success" | "warning" | "info" | "error";

interface Log {
  tag?: string;
  message: string;
  timestamp: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const getLogTypeColor = (tag?: string): string => {
  const colors: Record<string, string> = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    info: "text-blue-500",
  };
  return colors[tag?.toLowerCase() ?? ""] || "text-gray-500";
};

export const Logger = ({
  id,
  setStatus,
  logs,
  setLogs,
}: {
  id: string;
  setStatus: React.Dispatch<SetStateAction<Index["status"]>>;
  logs: Log[] | [];
  setLogs: React.Dispatch<SetStateAction<Log[]>>;
}) => {
  const searchParams = useSearchParams();
  const logsOpen = searchParams.get("logs");
  const [isOpen, setIsOpen] = useState(logsOpen === "open");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const fetchLogs = useCallback(
    async (retry = 0) => {
      try {
        setLoading(true);
        setIsOver(false);

        const res = await fetch(`/api/logs?id=${id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = (await res.json()) as {
          logs: Log[];
          isOver: boolean;
          status: Index["status"];
        };

        console.log("result", result.logs.length);

        setLogs(result.logs);
        setIsOver(result.isOver);
        setStatus(result.status);
        setRetryCount(0);
      } catch (error) {
        console.error("Error fetching logs:", error);

        if (retry < MAX_RETRIES) {
          setTimeout(() => fetchLogs(retry + 1), RETRY_DELAY * (retry + 1));
          setRetryCount(retry + 1);
        } else {
          setLogs((prev) => [
            ...prev,
            {
              type: "error",
              message: `Failed to load logs after ${MAX_RETRIES} attempts`,
              timestamp: Date.now(),
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    },
    [id, setLogs, setStatus]
  );

  useEffect(() => {
    let timeInterval: NodeJS.Timeout | undefined;
    if (!isOver) {
      fetchLogs();
      timeInterval = setInterval(fetchLogs, 5000);
    }

    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, [isOpen, id, isOver, fetchLogs]);

  useEffect(() => {
    logs.length < 1 && setIsOver(false);
  }, [logs]);

  useEffect(() => {
    if (logsContainerRef.current && logs.length > 0) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full px-3 py-5">
      <div className="w-full bg-[#090909] overflow-x-auto border border-[#191919] rounded-md">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-5 flex justify-between cursor-pointer"
        >
          <div className="flex gap-2 items-center">
            {isOver ? (
              <CircleCheckBig className="h-5 w-5" />
            ) : (
              <Loader className="text-blue-600" />
            )}
            <span className="text-[#757575]">Process Logs</span>
          </div>

          <ChevronRight
            className={`text-[#656565] transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-200 ${
            isOpen ? "h-[250px]" : "h-0"
          }`}
        >
          <div ref={logsContainerRef} className="px-4 pb-4 h-full overflow-y-auto">
            {loading && logs.length < 1 ? (
              <div className="text-[#656565] flex flex-col gap-2 justify-center items-center h-full text-xl">
                <Loader className="text-blue-600" />
                <span>
                  Loading logs
                  {retryCount > 0
                    ? ` (Retry ${retryCount}/${MAX_RETRIES})`
                    : ""}
                  ...
                </span>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-[#656565] flex justify-center items-center h-full text-xl">
                <span>No logs available</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={log.timestamp} className="py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#656565]">
                      {format(new Date(log.timestamp), "HH:mm:ss")}
                    </span>
                    <span className={`${getLogTypeColor(log.tag)}`}>
                      [{log.tag}]
                    </span>
                    <span className={`${getLogTypeColor(log.tag)}`}>
                      {log.message}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
