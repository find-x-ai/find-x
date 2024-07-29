import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { approveRequest } from "../app/actions/requests";
import { LogMessage, ScrapedData } from "@/types";
import { index } from "@/lib/vector";

interface Info {
  name: string;
  url: string;
  plan: string;
  email: string;
  id: string;
  update: boolean;
}

interface EmbeddingResult {
  success: boolean;
  failedChunks: number[];
  embeddedChunks: number[];
  clientId: string;
}

const CHUNK_SIZE = 5;
const COUNTDOWN_TIME = 10;
const MAX_RETRIES = 3;

export const useEmbedding = (
  info: Info,
  scrapedData: ScrapedData[],
  setLogMessages: React.Dispatch<React.SetStateAction<LogMessage[]>>,
  router: ReturnType<typeof useRouter>
) => {
  const [isEmbedding, setIsEmbedding] = useState<boolean>(false);
  const [disableEmbedding, setDisableEmbedding] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const beepSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    beepSoundRef.current = new Audio("/beep.mp3");
    return () => {
      if (beepSoundRef.current) {
        beepSoundRef.current.pause();
        beepSoundRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const logMessage = useCallback(
    (message: string, tag: string, color: string) => {
      setLogMessages((prevMessages) => [
        ...prevMessages,
        { tag, message, color },
      ]);
    },
    [setLogMessages]
  );

  const validateInfo = useCallback(
    (info: Info): boolean => {
      if (!info.name || !info.url || !info.plan || !info.email) {
        logMessage("Missing required information", "[ERROR]", "text-red-500");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
        logMessage("Invalid email format", "[ERROR]", "text-red-500");
        return false;
      }
      return true;
    },
    [logMessage]
  );

  const handleEmbedding = useCallback(async () => {
    if (!validateInfo(info)) return;

    setIsEmbedding(true);
    logMessage(
      `Attention: This action cannot be undone!`,
      "[IMPORTANT]",
      "text-red-500"
    );

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const countDown = async (timeLeft: number): Promise<void> => {
      if (controller.signal.aborted) {
        logMessage(`Embedding cancelled by user`, "[USER]", "text-red-500");
        return;
      }
      if (beepSoundRef.current) {
        beepSoundRef.current.currentTime = 0;
        await beepSoundRef.current.play().catch(console.error);
      }

      logMessage(
        `Embedding will start in ${timeLeft
          .toString()
          .padStart(2, "0")} sec(s)`,
        "[WARNING]",
        "text-amber-500"
      );

      if (timeLeft > 0) {
        setTimeout(() => countDown(timeLeft - 1), 1000);
      } else {
        await startEmbedding();
      }
    };

    const startEmbedding = async (): Promise<void> => {
      logMessage(`Embedding started...`, "[INFO]", "text-white");
      setIsEmbedding(false);
      setDisableEmbedding(true);

      try {
        const chunks = chunkArray(scrapedData, CHUNK_SIZE);

        let result: EmbeddingResult;
        if (info.update) {
          result = await updateWebsite(chunks);
        } else {
          result = await createNewWebsite(chunks);
        }

        if (result.success) {
          logMessage(
            `Embedding process completed successfully`,
            "[SUCCESS]",
            "text-green-500"
          );
        } else {
          logMessage(
            `Embedding process failed. Cleaning up partial embeddings...`,
            "[WARNING]",
            "text-yellow-500"
          );
          await cleanupPartialEmbeddings(
            result.clientId,
            result.embeddedChunks
          );
          logMessage(
            `Cleanup completed. Failed chunks: ${result.failedChunks.join(
              ", "
            )}`,
            "[INFO]",
            "text-blue-500"
          );
        }
      } catch (error) {
        console.error(error);
        logMessage(`${error}`, "[ERROR]", "text-red-500");
      } finally {
        setDisableEmbedding(false);
      }
    };

    countDown(COUNTDOWN_TIME);
  }, [info, scrapedData, router, logMessage, validateInfo]);

  const updateWebsite = async (
    chunks: ScrapedData[][]
  ): Promise<EmbeddingResult> => {
    logMessage(`Updating the website...`, "[INFO]", "text-white");
    if (!info.id) {
      throw new Error("Missing ID for update operation");
    }

    return await processChunks(info.id, chunks);
  };

  const createNewWebsite = async (
    chunks: ScrapedData[][]
  ): Promise<EmbeddingResult> => {
    const key = uuidv4();
    const client = await insertNewClient(key);

    const result = await processChunks(client.id, chunks);

    if (result.success) {
      logMessage(`Created client successfully`, "[SUCCESS]", "text-green-500");

      if (info.id) {
        await approveRequest(parseInt(info.id));
      }
      logMessage(`Created API key successfully`, "[SUCCESS]", "text-green-500");
      setTimeout(() => {
        router.push("/all");
      }, 1500);
    }

    return result;
  };

  const processChunks = async (
    clientId: string,
    chunks: ScrapedData[][]
  ): Promise<EmbeddingResult> => {
    const failedChunks: number[] = [];
    const embeddedChunks: number[] = [];

    for (let i = 0; i < chunks.length; i++) {
      let success = false;
      for (let retry = 0; retry < MAX_RETRIES; retry++) {
        try {
          await upsertChunk(clientId, chunks[i]);
          success = true;
          embeddedChunks.push(i);
          break;
        } catch (error) {
          logMessage(
            `Error processing chunk ${i + 1}. Retry ${
              retry + 1
            }/${MAX_RETRIES}`,
            "[WARNING]",
            "text-yellow-500"
          );
        }
      }
      if (!success) {
        // Give the failed chunk one more try
        logMessage(
          `Chunk ${i + 1} failed. Giving it one last try...`,
          "[INFO]",
          "text-blue-500"
        );
        try {
          await upsertChunk(clientId, chunks[i]);
          success = true;
          embeddedChunks.push(i);
          logMessage(
            `Chunk ${i + 1} embedded successfully on final try`,
            "[SUCCESS]",
            "text-green-500"
          );
        } catch (error) {
          logMessage(
            `Chunk ${i + 1} failed on final try. Stopping process.`,
            "[ERROR]",
            "text-red-500"
          );
          failedChunks.push(i + 1);
          break;
        }
      }
    }

    if (failedChunks.length > 0) {
      logMessage(
        `Embedding process stopped. Running cleanup...`,
        "[WARNING]",
        "text-yellow-500"
      );
      await cleanupPartialEmbeddings(clientId, embeddedChunks);
    }

    return {
      success: failedChunks.length === 0,
      failedChunks,
      embeddedChunks,
      clientId,
    };
  };

  const cleanupPartialEmbeddings = async (
    clientId: string,
    _embeddedChunks: number[]
  ): Promise<void> => {
    logMessage(
      `Starting cleanup of partial embeddings...`,
      "[INFO]",
      "text-blue-500"
    );

    try {
      await index.deleteNamespace(clientId.toString());
      logMessage(
        `Cleanup completed successfully`,
        "[SUCCESS]",
        "text-green-500"
      );
    } catch (error) {
      console.error(error);
      logMessage(`Error during cleanup: ${error}`, "[ERROR]", "text-red-500");
    }
  };

  const insertNewClient = async (key: string) => {
    const result = await db(
      `INSERT INTO clients (name, email, api_key, plan, url , total_requests , remaining) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [
        info.name,
        info.email,
        key,
        parseInt(info.plan),
        info.url,
        0,
        parseInt(info.plan),
      ]
    );
    if (!result || result.length === 0) {
      throw new Error("Failed to insert new client");
    }
    return result[0] as { id: string };
  };

  const upsertChunk = async (
    clientId: string,
    chunk: ScrapedData[]
  ): Promise<void> => {
    const res = await fetch(process.env.NEXT_PUBLIC_UPSERT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_UPSERT_KEY!}`,
      },
      body: JSON.stringify({
        client: clientId,
        data: chunk,
        secret_key: process.env.NEXT_PUBLIC_UPSERT_KEY!,
      }),
    });

    if (!res.ok) {
      throw new Error(
        `Error generating vector embeddings for chunk: ${res.statusText}`
      );
    }

    logMessage(
      `Successfully generated vector embeddings for chunk`,
      "[SUCCESS]",
      "text-green-500"
    );
  };

  const cancelEmbedding = useCallback(() => {
    setIsEmbedding(false);
    abortControllerRef.current?.abort();
  }, []);

  return {
    isEmbedding,
    disableEmbedding,
    handleEmbedding,
    cancelEmbedding,
  };
};

function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}
