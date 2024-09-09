"use client";
import { db } from "@/lib/db";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import CountUp from "react-countup";

type Client = {
  id: number;
  joined_at: string;
  url: string;
  name: string;
  plan: string;
  key: string;
  email: string;
  total_requests: string;
  remaining: number;
};

type Log = {
  time: Date;
  name: string;
  status: number;
};

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [isClientLoading, setIsClientLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<Log[]>([
    { status: 200, name: "Fetching logs...", time: new Date() },
  ]);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const fetchClientData = async () => {
    try {
      const res = (await db("SELECT * FROM clients")) as Client[];
      setClients(res);
      const total = res.reduce((sum, client) => sum + parseInt(client.total_requests), 0);
      setTotalRequests(total);
    } catch (err) {
      console.error("Error fetching client data:", err);
    }
  };

  const fetchLogs = async () => {
    setIsLogsLoading(true);

    try {
      const dbRes = (await db("SELECT * FROM logs")) as Log[];
      if (!dbRes || dbRes.length === 0) {
        setLogs([{ time: new Date(), name: "Fetch failed", status: 500 }]);
      } else {
        setLogs(dbRes);
      }

      // Fetch updated client data to refresh total requests
      await fetchClientData();
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs([
        {
          status: 500,
          name: "Unable to retrieve logs",
          time: new Date(),
        },
      ]);
    }

    setIsLogsLoading(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsClientLoading(true);
      await fetchClientData();
      await fetchLogs();
      setIsClientLoading(false);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(fetchLogs, 5000);
      timeoutRef.current = setTimeout(() => {
        setIsLive(false);
      }, 30000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLive]);

  return (
    <main className="h-full max-h-screen flex flex-col">
      <div className="border-b bg-black p-5 flex justify-between items-center border-zinc-900">
        <div>
          <h1 className="text-2xl text-white">Hey team!</h1>
          <h3 className="my-2 opacity-75 text-white/90">Welcome to find-x</h3>
        </div>
        <div className="flex gap-3 text-white items-center">
          <Label>Go Live</Label>
          <Switch checked={isLive} onCheckedChange={setIsLive} />
        </div>
      </div>
      <div className="p-5 h-full flex gap-5">
        <div className="flex flex-col gap-5 w-[350px]">
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center p-3 border border-zinc-800 overflow-hidden rounded-xl relative">
            <div className="cardwithbg bg-black w-full h-full absolute z-10 blur-[2px] opacity-20"></div>
            <div className="w-full h-full flex justify-center items-center flex-col gap-3">
              <h1 className="text-3xl font-semibold text-white text-center z-20">
                <CountUp duration={1.5} start={0} end={totalRequests} />
              </h1>
              <p className="text-zinc-400 text-center text-sm z-20">
                Total queries to date
              </p>
            </div>
          </div>
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center p-3 border border-zinc-800 overflow-hidden rounded-xl relative ">
            <div className="cardwithbg bg-black w-full h-full absolute z-10 blur-[2px] opacity-20"></div>
            <div className="w-full h-full flex justify-center items-center flex-col">
              <h1 className="text-4xl font-semibold text-white h-[60px] z-20 text-center">
                {isClientLoading ? (
                  <Loader2 className="animate-spin w-[28px] h-[28px] duration-300" />
                ) : (
                  clients.length
                )}
              </h1>
              <p className="text-zinc-400 z-20 text-center text-sm">
                Total clients
              </p>
            </div>
          </div>
        </div>
        <div className="w-full bg-black rounded-xl border overflow-hidden relative border-zinc-800">
          <div className="p-3 border-b flex bg-zinc-950/20 absolute top-0 w-full justify-between items-center border-zinc-900 backdrop-blur-sm">
            <p className="text-zinc-400">Query server logs</p>
            <div className="flex gap-2">
              <div
                title="Error"
                className="w-3 h-3 bg-red-500/70 rounded-full"
              ></div>
              <div
                title="Success"
                className="w-3 h-3 bg-green-500/70 rounded-full"
              ></div>
              <div
                title="Warning"
                className="w-3 h-3 bg-yellow-500/70 rounded-full"
              ></div>
            </div>
          </div>
          <div className="text-zinc-300 h-[440px] pt-[50px] flex-1 scrollbar-hide font-mono overflow-y-scroll pb-5">
            {isLogsLoading && logs.length < 2 ? (
              <div className="flex w-full h-full flex-col gap-3 justify-center items-center text-white">
                <Loader2 className="animate-spin w-[28px] h-[28px] duration-300" />
                <span className="text-zinc-600 font-sans">Loading logs...</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={`flex justify-between border-b border-zinc-800 px-5 py-2 ${
                    i % 2 === 0 ? "bg-zinc-950" : ""
                  }`}
                >
                  <span className="text-sm p-1 rounded-md border border-zinc-800 text-blue-600">
                    {log.time.toDateString()}
                  </span>
                  <span className="text-start w-[200px]">{log.name}</span>
                  <span
                    className={`text-sm rounded-md p-1 ${
                      log.status === 200
                        ? "bg-green-500/10 text-green-500 border border-green-500"
                        : log.status === 500
                        ? "bg-red-500/10 text-red-500 border border-red-500"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500"
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              ))
            )}
            <div ref={logsEndRef}></div>
          </div>
        </div>
      </div>
    </main>
  );
}
