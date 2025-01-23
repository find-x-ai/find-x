"use client";
import React from "react";
import { CreateIndex } from "./create-index";
import { Index } from "@/actions/types";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  RotateCw,
  SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getIndexes } from "@/actions/indexing";

type IndexWithContentLength = Omit<Index, "content"> & {
  content_length: number;
};

function getRelativeTimeString(dateInput: string | Date): string {
  try {
    // Convert string input to Date object if needed
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    const now = new Date();

    // Validate if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Handle small time differences that might appear as future due to clock sync
    if (Math.abs(diffInSeconds) < 30) {
      return "Just now";
    }

    // Handle future dates (with a small buffer for clock sync issues)
    if (diffInSeconds < -30) {
      return "Invalid date";
    }

    // Minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    // Hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    // Days
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }

    // Months
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    }

    // Years
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  } catch (error) {
    return "Invalid date";
  }
}

export function AllIndexes() {
  const [allIndexes, setAllIndexes] = useState<IndexWithContentLength[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleFetch = async () => {
      setLoading(true);
      const res = await getIndexes();
      if (res.length > 0) {
        // Sort indexes by created_at in ascending order (oldest first)
        const sortedIndexes = [...res].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setAllIndexes(sortedIndexes);
      }
      setLoading(false);
    };
    handleFetch();
  }, []);
  return (
    <main className="w-full h-full">
      {" "}
      {allIndexes.length === 0 && !loading ? (
        <CreateIndex text="Create Index +" heading={true} />
      ) : (
        <div className="flex flex-col w-full h-full max-w-6xl mx-auto ">
          <IndexpageHeader />
          <div className="w-full h-full">
            <div className="flex flex-col w-full h-full p-5 gap-3">
              {allIndexes.map((index, i) => {
                return (
                  <div
                    onClick={() =>
                      router.push(`/dashboard/indexing/${index.name}`)
                    }
                    className="w-full cursor-pointer hover:bg-[#141414] p-5 flex text-center items-center border border-[#353535] rounded-md"
                    key={index.url}
                  >
                    <div className="w-[50px]">
                      <span className="text-[#656565]">{i + 1}</span>
                    </div>
                    <div className="w-full text-start pl-5">
                      <span>{index.name}</span>
                    </div>
                    <div
                      className={`w-full text-start ${
                        index.status === "success"
                          ? "text-green-600"
                          : index.status === "deploying"
                          ? "text-yellow-500"
                          : "text-red-600"
                      }`}
                    >
                      <span className=" flex w-full  items-center gap-2 ">
                        <span className="relative flex h-3 w-3">
                          <span
                            className={`${
                              index.status === "deploying" && "animate-ping"
                            } absolute inline-flex h-full w-full rounded-full opacity-75 bg-yellow-500`}
                          ></span>
                          <span
                            className={`relative inline-flex rounded-full h-3 w-3 ${
                              index.status === "success"
                                ? "bg-green-500"
                                : index.status === "failed"
                                ? "bg-red-600"
                                : "bg-yellow-500"
                            }`}
                          ></span>
                        </span>
                        {index.status === "success"
                          ? "Ready"
                          : index.status.replace(
                              index.status[0],
                              index.status[0].toLocaleUpperCase()
                            )}
                      </span>
                    </div>
                    <div className=" hidden sm:block w-full">
                      <span>{index.content_length || 0} pages</span>
                    </div>
                    <div className="text-start hidden xl:block w-full">
                      <span>{index.url}</span>
                    </div>
                    <div className="w-full hidden sm:block">
                      <span className="text-[#656565]">
                        {getRelativeTimeString(index.last_deploy)}
                      </span>
                    </div>
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className=" ring-0 outline-0 hover:bg-[#353535] p-2 rounded-md"
                          asChild
                        >
                          <button>
                            <EllipsisVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              className="flex gap-2 items-center w-full"
                              target="_blank"
                              href={index.url}
                            >
                              <span>Visit</span>
                              <SquareArrowOutUpRight className="w-4 h-4 text-[#757575]" />
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const IndexpageHeader = () => {
  return (
    <div className="flex justify-between items-center p-5 pt-10 w-full">
      <h1 className="text-2xl font-semibold">Indexes</h1>
      <CreateIndex text="Create Index +" heading={false} />
    </div>
  );
};
