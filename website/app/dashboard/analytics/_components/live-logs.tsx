import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Log = {
  id: number;
  index_id: number;
  query: string;
  type: string;
  status: number;
  name: string;
};
export const LiveLogs = ({
  logs,
  setLogs,
}: {
  logs: Log[];
  setLogs: (logs: Log[]) => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchLogs = async () => {
      if (count > 30){
        clearInterval(intervalId);
        return;
      };
      setIsLoading(true);
      try {
        const res = await fetch("/api/analytics/live");
        if(!res.ok){
          throw new Error("Failed to fetch logs");
        }
        const { data } = (await res.json()) as { data: Log[] };
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setIsLoading(false);
        setCount(count + 1);
      }
    };

    intervalId = setInterval(() => {
      fetchLogs();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="bg-[#121212]  border border-[#202020] w-full p-5 rounded-lg flex flex-col gap-4">
      {/* Header */}
      <div className="w-full flex items-center gap-2">
        <h3 className="text-sm text-muted-foreground animate-pulse">
          Live logs
        </h3>
        <Loader2 className="animate-spin w-3 h-3 text-muted-foreground" />
      </div>

      {/* Logs Content */}
      {logs.length < 1 ? (
        <div className="p-4 bg-[#121212] rounded-lg text-center">
          {isLoading ? (
            <h3 className="text-muted-foreground">Loading logs...</h3>
          ) : (
            <h3 className="text-muted-foreground">No logs found</h3>
          )}
        </div>
      ) : (
        <div className="rounded-lg">
          <div className="flex flex-col gap-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="grid sm:grid-cols-4 grid-cols-2 gap-4 items-center p-3 rounded-lg bg-[#181818] hover:bg-[#202020] transition"
              >
                {/* Query */}
                <p
                  className="text-gray-300 text-sm truncate col-span-1"
                  title={log.query}
                >
                  {log.query}
                </p>

                {/* Status */}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded text-center col-span-1 ${
                    log.status === 200
                      ? "text-green-400"
                      : log.status === 500
                      ? "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {log.status === 200
                    ? "Success"
                    : log.status === 500
                    ? "Error"
                    : `Status: ${log.status}`}
                </span>

                {/* Type (hidden on small screens) */}
                <p
                  className="text-gray-400 text-sm truncate hidden sm:block"
                  title={log.type}
                >
                  {log.type}
                </p>

                {/* Name (hidden on small screens) */}
                <p
                  className="text-gray-400 text-sm truncate hidden sm:block"
                  title={log.name}
                >
                  {log.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ThreeDotsLoader = () => (
  <div className="flex gap-1 items-center">
    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-200" />
    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce delay-400" />
  </div>
);
