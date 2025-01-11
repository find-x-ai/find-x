"use client";
import { Index } from "@/actions/types";
import { Header } from "./header";
import { Key } from "./key";
import { useEffect, useState } from "react";
import { Progress } from "./progress";
import { useIndex } from "@/context/index-context";
type LogType = "success" | "warning" | "info" | "error";

interface Log {
  tag?: string;
  message: string;
  timestamp: number;
}

export const Screen = ({ index }: { index: Index }) => {
  const [indexObj, _setIndexObj] = useState<Index>(index);
  const { setIndex, index: indexContext } = useIndex();

  useEffect(() => {
    setIndex(indexObj);
  }, [indexObj]);

  if (!indexContext) return <div>Loading...</div>;

  return (
    <main>
      <Header />
      {indexContext?.status === "deploying" && <Progress />}
      <Key api_key={indexContext?.api_key} />
    </main>
  );
};
