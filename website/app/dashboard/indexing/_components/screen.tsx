"use client";
import { Index } from "@/actions/types";
import { Header } from "./header";
import { Key } from "./key";
import { useEffect, useState } from "react";
import { Progress } from "./progress";
import { useIndex } from "@/context/index-context";
import Steps from "./steps.mdx";
import Link from "next/link";

export const Screen = ({ index, processData }: { index: Index, processData: {
  queueLength: number;
  scrapedDataLength: number;
  visitedLength: number;
  percentage: number;
} }) => {
  const [indexObj, _setIndexObj] = useState<Index>(index);
  const { setIndex, index: indexContext } = useIndex();

  useEffect(() => {
    setIndex(indexObj);
  }, [indexObj]);

  if (!indexContext) return <div>Loading...</div>;

  return (
    <main>
      <Header />
      {indexContext?.status === "deploying" && <Progress initialProcessData={processData} />}
      <Key api_key={indexContext?.api_key} />
      <div className="p-5 w-full max-w-[1100px]">
        <StepsWrapper apiKey={indexContext?.api_key} />
        <KnowMore />
      </div>
    </main>
  );
};

const StepsWrapper = ({ apiKey }: { apiKey: string }) => {
  return (
    <div className="docs">
      {/* @ts-ignore */}
      <Steps apiKey={apiKey} />
    </div>
  );
};

const KnowMore = () => {
  return (
   <div className="w-full">
     <div className="flex flex-col p-8 bg-[#141414] rounded-lg border border-[#202020] mt-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Want to learn more?</h2>
        <p className="text-muted-foreground mt-2">Check out our comprehensive documentation to get the most out of our search functionality.</p>
      </div>
      <Link
        className="inline-flex items-center px-4 py-2.5 bg-[#141414] hover:bg-[#202020] text-gray-200 font-medium rounded-lg border border-[#202020] transition-colors duration-200 max-w-fit"
        href="/docs/getting_started"
      >
        View documentation
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
   </div>
  );
};
