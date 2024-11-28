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

function getRelativeTimeString(dateInput: string | Date): string {
  // Convert string input to Date object if needed
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  // Validate if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle future dates
  if (diffInSeconds < 0) {
    return "In the future";
  }

  // Less than a minute
  if (diffInSeconds < 60) {
    return "Just now";
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
}

export function AllIndexes({ indexes }: { indexes: Index[] }) {
  const [allIndexes, setAllIndexes] = useState<Index[]>(indexes);
  const router = useRouter();

  useEffect(() => {
    const handleFetch = async () => {
      const res = await getIndexes();
      if (res.length > 0) {
        setAllIndexes(res);
      }
    };
    handleFetch();
  }, []);
  return (
    <main className="w-full h-full">
      {" "}
      {indexes.length === 0 ? (
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
                      <span>{index.name.toUpperCase()}</span>
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
                      <span>{index.total_links} pages</span>
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
