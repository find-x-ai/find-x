"use client";
import { Index } from "@/actions/types";
import { RotateCw, Settings } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getIndex } from "@/actions/indexing";
export const Header = ({ index }: { index: Index }) => {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<
    "success" | "failed" | "deploying" | "queued"
  >(index.status);
  useEffect(() => {
    const fetchIndex = async () => {
      const res = await getIndex(index.id.toString());
      if (res.success && res.data) {
        setStatus(res.data.status);
      }
    };
    fetchIndex()
  }, [searchParams]);
  return (
    <div className="w-full p-4 border-b border-[#202020] flex md:flex-row flex-col gap-5 justify-between items-center">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-2xl font-semibold">{index.name}</h1>
        <p className="text-[#656565] text-sm">
          {index.created_at.toLocaleString("en-us")}
        </p>
      </div>
      <div className="flex w-full md:justify-end justify-start gap-3">
        <div
          className={`flex items-center gap-2 border px-3 py-1 rounded-md ${
            index.status === "success"
              ? "border-green-500 text-green-500 bg-green-600/10"
              : index.status === "deploying"
              ? "border-yellow-500 text-yellow-500 bg-yellow-600/10"
              : "border-red-500 text-red-500 bg-red-600/10"
          }`}
        >
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                index.status === "success"
                  ? "bg-green-600"
                  : index.status === "deploying"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                status === "success"
                  ? "bg-green-600"
                  : status === "deploying"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            ></span>
          </span>
          <div>
            <span className="text-sm sm:text-md">
              {status === "success"
                ? "Ready"
                : status === "deploying"
                ? "Deploying"
                : "Failed"}
            </span>
          </div>
        </div>
        <div>
          <button className="px-3 py-2 md:w-[120px] group hover:bg-[#181818] rounded-md border border-[#202020] flex items-center justify-center gap-2">
            <span className="sm:block hidden">Redeploy</span>{" "}
            <RotateCw className="w-5 h-5 transition-transform duration-700 group-hover:rotate-[360deg] text-[#656565]" />
          </button>
        </div>
        <div>
          <button className="px-3 py-2 md:w-[120px] group hover:bg-[#181818] rounded-md border border-[#202020] flex items-center justify-center gap-2">
            <span className="sm:block hidden">Settings</span>
            <Settings className="w-5 h-5 transition-transform duration-700 group-hover:rotate-[360deg] text-[#656565]" />
          </button>
        </div>
      </div>
    </div>
  );
};
