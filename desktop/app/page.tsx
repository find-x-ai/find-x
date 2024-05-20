"use client";
import { db } from "@/lib/db";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { redis } from "@/lib/redis";

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

  const [clientloading, setClientLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      db.from("clients")
        .select("*")
        .then((fetchedData) => {
          
          if(fetchedData.data){
            //@ts-ignore
            setData(fetchedData.data);
          }
          
        });

      setClientLoading(false);

      redis
        .get("average")
        .then((analytics) => {
          if (analytics) {
            //@ts-ignore
            setAverage(analytics.average);
            setAverageLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setAverage(0);
          setAverageLoading(false);
        });
    };

    fetchData();
  }, []);

  return (
    <main className="h-screen flex flex-col">
      <div className="border-b bg-black p-5 border-zinc-900">
        <h1 className="text-2xl text-white">Hey team !</h1>
        <h3 className="my-2 opacity-75 text-white/90">welcome to find-x</h3>
      </div>
      <div className="p-5 h-full flex gap-5">
        <div className="flex flex-col gap-5 w-[350px]">
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center p-3 border border-zinc-900 rounded-xl bg-black">
            <h1 className="text-3xl font-semibold text-white text-center">
              {averageLoading ? (
                <span>
                  <Loader2 className=" animate-spin w-[28px] h-[28px] duration-300" />
                </span>
              ) : (
                average
              )}
            </h1>
            <p className="text-zinc-700 text-center text-sm">
              Average response time
            </p>
          </div>
          <div className="w-full h-full flex flex-col gap-2 justify-center items-center p-3 border border-zinc-900 rounded-xl bg-black">
            <h1 className="text-4xl font-semibold text-white h-[60px] text-center">
              {clientloading ? (
                <span>
                  <Loader2 className=" animate-spin w-[28px] h-[28px] duration-300" />
                </span>
              ) : (
                data.length
              )}
            </h1>
            <p className="text-zinc-700 text-center text-sm">Total clients</p>
          </div>
        </div>
        <div className="w-full h-full bg-black rounded-xl border border-zinc-900">
          <div className="p-3 border-b flex justify-between items-center border-zinc-900">
            <p className="text-zinc-700">Query server logs</p>
            <div className="flex gap-2">
              <div
                title="Error"
                className="w-[12px] h-[12px] bg-red-500/70 rounded-full"
              ></div>
              <div
                title="success"
                className="w-[12px] h-[12px] bg-green-500/70 rounded-full"
              ></div>
              <div
                title="warning"
                className="w-[12px] h-[12px] bg-yellow-500/70 rounded-full"
              ></div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </main>
  );
}
