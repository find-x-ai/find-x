"use client";
import { ClipboardCheck, Copy } from "lucide-react";
import { useEffect, useState } from "react";

function CodeCopy({
  children,
  code,
}: {
  children: React.ReactNode;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  const handleCopy = async () => {
    setCopied(true);
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="relative w-full max-w-[1100px]">
      <div className="absolute top-1 right-1">
        <button
          className="w-7 h-7 flex items-center justify-center rounded-[2px] text-[#404040] border border-[#303030] bg-[#141414]"
          onClick={handleCopy}
        >
          {copied ? (
            <ClipboardCheck className="w-5 h-5 scale-[0.80]" />
          ) : (
            <Copy className="w-5 h-5 scale-[0.80]" />
          )}
        </button>
      </div>
      <div
        className="code-block"
        dangerouslySetInnerHTML={{ __html: children!.toString() }}
      />
    </div>
  );
}

export { CodeCopy };
