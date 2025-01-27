"use client";
import { CountCard } from "./_components/all-count-card";
import { SuccessRateCard } from "./_components/success-rate-card";
import { CachedCountCard } from "./_components/cached-count-card";
import { LiveLogs } from "./_components/live-logs";
import { useState, useEffect } from "react";

type Data = {
  normal: number;
  cached: number;
  successRate: number;
  total: number;
  loading: boolean;
};

type Log = {
  id: number;
  index_id: number;
  query: string;
  type: string;
  status: number;
  name: string;
};

const page = () => {
  const [data, setData] = useState<Data>({
    normal: 0,
    cached: 0,
    successRate: 0,
    total: 0,
    loading: true,
  });

  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setData((prev) => ({ ...prev, loading: true })); // Keep existing state, just set loading to true
      try {
        const res = await fetch("/api/analytics");
        const { data: newData } = (await res.json()) as { data: Data };
        console.log(newData);
        setData((prev) => ({ ...prev, ...newData, loading: false })); // Merge new data with the current state
      } catch (error) {
        console.log(error);
        setData((prev) => ({ ...prev, loading: false })); // Handle error, but turn off loading
      }
    };
    fetchData();
  }, [logs]);

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 pb-0">
        <CountCard
          loading={data.loading}
          title="Total Requests"
          count={data.total}
          description="Total requests count"
        />
        <CachedCountCard
          loading={data.loading}
          title="Cached Requests"
          count={data.cached}
          description="Cached requests count"
        />
        <SuccessRateCard loading={data.loading} rate={data.successRate} />
      </div>
      <div className="p-5">
        <LiveLogs logs={logs} setLogs={setLogs} />
      </div>
    </div>
  );
};

export default page;
