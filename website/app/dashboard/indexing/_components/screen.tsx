"use client";
import { Index } from "@/actions/types";
import { Header } from "./header";
import { Key } from "./key";
import { useState } from "react";
import { Progress } from "./progress";
type LogType = "success" | "warning" | "info" | "error";

interface Log {
  tag?: string;
  message: string;
  timestamp: number;
}

export const Screen = ({
  index,
}: {
  index: Index;
}) => {
  const [indexObj, _setIndexObj] = useState<Index>(index);
  const [status, setStatus] = useState<Index["status"]>(index.status);
  return (
    <main>
      <Header
        id={indexObj.id.toString()}
        url={indexObj.url}
        status={status}
        name={indexObj.name}
        created_at={indexObj.created_at}
      />
      <Progress indexId={indexObj.id.toString()} />
      <Key api_key={indexObj.api_key} />
    </main>
  );
};
