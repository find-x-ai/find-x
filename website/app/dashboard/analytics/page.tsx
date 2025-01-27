"use client";
import { CountCard } from "./_components/all-count-card";
import { SuccessRateCard } from "./_components/success-rate-card";
import { CachedCountCard } from "./_components/cached-count-card";
import { useState, useEffect } from "react";

type Data = {
  normal: number;
  cached: number;
  successRate: number;
  total: number;
  loading: boolean;
};

const page = () => {
  const [data, setData] = useState<Data>({
    normal: 0,
    cached: 0,
    successRate: 0,
    total: 0,
    loading: true,
  });

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
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
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
    </div>
  );
};

export default page;
