"use client";
import { Index } from "@/actions/types";
import { Logger } from "./logger";
import { Header } from "./header";
import { Key } from "./key";
import { useState } from "react";

type LogType = "success" | "warning" | "info" | "error";

interface Log {
  tag?: string;
  message: string;
  timestamp: number;
}

export const Screen = ({ index }: { index: Index }) => {
  const [indexObj, setIndexObj] = useState<Index>(index);
  const [status, setStatus] = useState<Index["status"]>(index.status);
  const [logs, setLogs] = useState<Log[] | []>([]);

  return (
    <main>
      <Header
        id={indexObj.id.toString()}
        url={indexObj.url}
        status={status}
        name={indexObj.name}
        created_at={indexObj.created_at}
        setLogs={setLogs}
      />
      <Logger
        id={indexObj.id.toString()}
        setStatus={setStatus}
        logs={logs}
        setLogs={setLogs}
      />
      <Key api_key={indexObj.api_key} />
    </main>
  );
};
