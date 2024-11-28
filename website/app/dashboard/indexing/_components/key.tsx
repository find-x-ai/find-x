"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons"; // Assuming you're using radix-ui icons

export const Key = ({ api_key }: { api_key: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(api_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-3 flex flex-col gap-2">
      <span className="w-full text-start px-2">API KEY</span>
      <div className="flex w-full max-w-[400px] items-center gap-2 p-4 bg-[#141414] rounded-lg border border-[#202020]">
        <code className="flex-1 font-mono text-sm text-gray-200">
          {api_key}
        </code>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-[#202020] rounded-md transition-colors"
          title="Copy API key"
        >
          {copied ? (
            <CheckIcon className="w-4 h-4 text-green-500" />
          ) : (
            <CopyIcon className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
};
