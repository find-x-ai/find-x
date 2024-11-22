"use client";

import { useEffect, useState, useRef } from "react";

type LogType = "success" | "warning" | "info" | "error";

interface Log {
  type: LogType;
  message: string;
  timestamp: number;
}

export const Logger = ({ id }: { id: string }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/logs?id=${id}`);
        const data = await response.json();
        setLogs(data.logs);
        setIsOver(data.isOver);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    // Initial fetch
    fetchLogs();

    // Set up periodic fetching only if not over
    let interval: NodeJS.Timeout | null = null;
    if (!isOver) {
      interval = setInterval(fetchLogs, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOver]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getLogColor = (type: LogType) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "error":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  const getLogIcon = (type: LogType) => {
    switch (type) {
      case "success":
        return "✓";
      case "warning":
        return "⚠";
      case "error":
        return "✕";
      default:
        return "ℹ";
    }
  };

  return (
    <div className="bg-[#111111] rounded-lg border border-[#202020] p-4 max-h-[600px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-white">System Logs</h2>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-start p-2 rounded-md hover:bg-[#202020] transition-colors"
          >
            <span className={`${getLogColor(log.type)} mr-2`}>
              {getLogIcon(log.type)}
            </span>
            <div className="flex-1">
              <p className="text-gray-200">{log.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No logs available
          </div>
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};
