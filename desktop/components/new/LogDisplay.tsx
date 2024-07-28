import { LogMessage } from "@/types";
import { useEffect, useRef } from "react";

export const LogDisplay = ({ logs }: { logs: LogMessage[] }) => {
    const logsEndRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [logs]);
  
    return (
      <div className="w-[100%] h-1 flex-grow overflow-x-hidden overflow-y-scroll scrollbar-hide border border-zinc-900 rounded-xl bg-black text-white">
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