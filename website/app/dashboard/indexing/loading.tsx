"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-full text-[#656565] w-full items-center justify-center">
      <div className="flex items-center gap-1">
        <span>Loading Indexes...</span>
        <Loader2 className="animate-spin w-4 h-4" />
      </div>
    </div>
  );
}
