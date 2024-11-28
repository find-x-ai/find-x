"use client";

import { Loader } from "@/components/ui/loader";
import { ChevronRight, CircleCheckBig } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
type LogType = "success" | "warning" | "info" | "error";

interface Log {
  type: LogType;
  message: string;
  timestamp: number;
}

export const Logger = ({ id }: { id: string }) => {
  const searchParams = useSearchParams();
  const logsOpen = searchParams.get("logs");
  const [isOpen, setIsOpen] = useState(logsOpen === "open");
  const [logs, setLogs] = useState<Log[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        logs.length < 1 && setLoading(true);
        const res = await fetch(`/api/logs?id=${id}`);
        const result = (await res.json()) as {
          logs: Log[];
          isOver: boolean;
          status: "deploying" | "failed" | "success";
        };
        setLogs(result.logs);
        setIsOver(result.isOver);
      } catch (error) {
        console.log(error);
        setLogs([
          ...logs,
          {
            type: "error",
            message: "Failed to load logs",
            timestamp: performance.now(),
          },
        ]);
      } finally {
        logs.length > 0 && setLoading(false);
      }
    };

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
  }, [isOpen, id, isOver]);

  useEffect(() => {
    isOver && router.push(`${path}?update=true`);
  }, [isOver]);

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
          <div className="px-4 pb-4 h-full overflow-y-auto">
            {/* Placeholder for logs */}
            {loading && logs.length < 1 && (
              <div className="text-[#656565] flex justify-center items-center h-full text-xl">
                {loading ? (
                  <span>Loading logs...</span>
                ) : (
                  <span>No logs available</span>
                )}
              </div>
            )}
            {logs.map((log) => (
              <div key={log.timestamp} className="py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{log.timestamp}</span>
                  <span
                    className={`text-${
                      log.type === "success"
                        ? "green-600"
                        : log.type === "error"
                        ? "red-600"
                        : "f0f0f0"
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
