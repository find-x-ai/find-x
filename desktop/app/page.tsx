"use client";
import { db } from "@/lib/db";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { redis } from "@/lib/redis";
import { Switch } from "../components/ui/switch";
import { Label } from "@/components/ui/label";

type Project = {
  id: number;
  joined_at: string;
  url: string;
  name: string;
  plan: string;
  key: string;
  email: string;
};

export default function Home() {
  const [data, setData] = useState<Project[]>([]);
  const [average, setAverage] = useState<number>();
  const [averageLoading, setAverageLoading] = useState<boolean>(true);
  const [clientLoading, setClientLoading] = useState<boolean>(true);
  const [logs, setLogs] = useState<
    [{ status: number; client: string; time: number }]
  >([{ status: 200, client: "", time: Date.now() }]);
  const [logsLoading, setLogsLoading] = useState<boolean>(true); // New state for logs loading
  const [isLive, setIsLive] = useState<boolean>(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Scroll to the latest log whenever logs change
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const fetchLogsAndAverage = async () => {
    setLogsLoading(true); // Set logs loading to true when fetching logs

    try {
      const logs = await redis.get("logs");
      if (logs) {
        //@ts-ignore
        setLogs(logs);
      }
    } catch (err) {
      console.log(err);
      setLogs([
        {
          status: 500,
          client: "unable to retrieve logs",
          time: Date.now(),
        },
      ]);
    }

    try {
      const analytics = await redis.get("average");
      if (analytics) {
        //@ts-ignore
        setAverage(analytics.average);
        setAverageLoading(false);
      }
    } catch (err) {
      console.log(err);
      setAverage(0);
      setAverageLoading(false);
    }

    setLogsLoading(false); // Set logs loading to false after fetching logs
  };

  useEffect(() => {
    const fetchData = async () => {
      db.from("clients")
        .select("*")
        .then((fetchedData) => {
          if (fetchedData.data) {
            //@ts-ignore
            setData(fetchedData.data);
          }
        });

      setClientLoading(false);

      fetchLogsAndAverage();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLive) {
      intervalRef.current = setInterval(fetchLogsAndAverage, 5000);
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLive]);

  return (
    <main className="h-full max-h-screen flex flex-col">
      <div className="border-b bg-black p-5 flex justify-between items-center border-zinc-900">
        <div>
          <h1 className="text-2xl text-white">Hey team !</h1>
          <h3 className="my-2 opacity-75 text-white/90">welcome to find-x</h3>
        </div>
        <div className="flex gap-3 text-white items-center">
          <Label>GO live</Label>
          <Switch checked={isLive} onCheckedChange={(s) => {
            setIsLive(s);
          }} />
        </div>
      </div>
      <div className="p-5 h-full flex gap-5">
        <div className="flex flex-col gap-5 w-[350px]">
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center p-3 border border-zinc-800 overflow-hidden rounded-xl relative">
            <div className="cardwithbg bg-black w-full h-full absolute z-10 blur-[2px] opacity-20"></div>
            <div className="w-full h-full flex justify-center items-center flex-col gap-3">
              <h1 className="text-3xl font-semibold text-white text-center z-20">
                {averageLoading ? (
                  <span>
                    <Loader2 className="animate-spin w-[28px] h-[28px] duration-300" />
                  </span>
                ) : (
                  average?.toFixed(0) + " ms"
                )}
              </h1>
              <p className="text-zinc-400 text-center text-sm z-20">
                Average response time
              </p>
            </div>
          </div>
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center p-3 border border-zinc-800 overflow-hidden rounded-xl relative ">
            <div className="cardwithbg bg-black w-full h-full absolute z-10 blur-[2px] opacity-20"></div>
            <div className="w-full h-full flex justify-center items-center flex-col">
              <h1 className="text-4xl font-semibold text-white h-[60px] z-20 text-center">
                {clientLoading ? (
                  <span>
                    <Loader2 className="animate-spin w-[28px] h-[28px] duration-300" />
                  </span>
                ) : (
                  data.length
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
                title="success"
                className="w-3 h-3 bg-green-500/70 rounded-full"
              ></div>
              <div
                title="warning"
                className="w-3 h-3 bg-yellow-500/70 rounded-full"
              ></div>
            </div>
          </div>
          <div className="text-zinc-300 h-[440px] pt-[50px] flex-1 scrollbar-hide font-mono overflow-y-scroll pb-5">
            {logsLoading && logs.length < 2 ? (
              <div className="flex w-full h-full flex-col gap-3 justify-center items-center text-white">
                <Loader2 className="animate-spin w-[28px] h-[28px] duration-300" />
                <span className="text-zinc-600 font-sans">Loading logs...</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={`flex justify-between border-b border-zinc-800 px-5 py-2 ${i % 2 === 0 && "bg-zinc-950"}`}>
                  <span className="text-sm p-1 rounded-md border border-zinc-800 text-blue-600">
                    {new Date(log.time).toDateString().slice(4, 20)}
                  </span>
                  <span className="text-start w-[200px]">{log.client}</span>
                  <span className={`text-sm rounded-md p-1 ${log.status === 200 ? "bg-green-500/10 text-green-500 border border-green-500" : log.status === 500 ? "bg-red-500/10 text-red-500 border border-red-500" : "bg-amber-500/10 text-amber-500 border border-amber-500"}`}>
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