"use client";

import React, { useState, useEffect } from "react";
import { SearchIcon, SparkleIcon } from "./icons/svgs";
import { getStreamingResponse } from "../actions/stream";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);

  const handleKeydown = (event: KeyboardEvent) => {
    // Check if the 'Escape' key is pressed
    if (event.key === "Escape") {
      setIsOpen(false);
    }

    // Check if 'Ctrl + K' is pressed
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
      event.preventDefault(); // Prevent the default browser behavior
      setIsOpen(true);
    }
  };

  const simulateStreamingResponse = async (query: string): Promise<string> => {
    const fullResponse = `This is a simulated response to your query: "${query}". It will be displayed gradually to mimic a real-time AI response. The text will appear as if it's being streamed in chunks, creating a more realistic chat completion effect similar to popular language models.<-$#$->https://example.com/link1,https://example.com/link2,https://example.com/link3`;

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      start(controller) {
        const encodedResponse = encoder.encode(fullResponse);
        let i = 0;
        const pushChunk = () => {
          if (i < encodedResponse.length) {
            const chunkSize = Math.floor(Math.random() * 5) + 1;
            const chunk = encodedResponse.slice(i, i + chunkSize);
            controller.enqueue(chunk);
            i += chunkSize;
            setTimeout(pushChunk, Math.random() * 25 + 15);
          } else {
            controller.close();
          }
        };
        pushChunk();
      },
    });

    const reader = stream.getReader();
    let result = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const decodedChunk = decoder.decode(value, { stream: true });
        result += decodedChunk;
        setResponse((prev) => prev + decodedChunk);
      }
    } finally {
      reader.releaseLock();
    }

    return result;
  };

  const handleSubmit = async (formData: FormData) => {
    const search = formData.get("search") as string;
    if (!search.trim() || isLoading) return;
    await new Promise((resolve) => setTimeout(resolve, 0));

    setIsLoading(true);
    setResponse("Loading...");
    setReferenceLinks([]);

    await new Promise((resolve) => setTimeout(resolve, 1300));
    setResponse("");
    try {
      await getStreamingResponse({ query: search });
      const fullResponse = await simulateStreamingResponse(search);

      // Parse the response to extract links
      const parts = fullResponse.split("<-$#$->");
      if (parts.length > 1) {
        setResponse(parts[0]);
        const extractedLinks = parts[1].split(",");
        setReferenceLinks(extractedLinks);
      } else {
        setResponse(fullResponse);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const ReferenceLinks = ({ links }: { links: string[] }) => (
    <div className="f-mt-2 f-px-2 f-flex f-flex-wrap f-gap-2">
      {links.map((link, index) => (
        <a
          title={link}
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="f-px-3 f-py-1 f-bg-zinc-900 f-text-zinc-200 f-rounded-full f-border f-border-zinc-700 f-text-sm hover:f-bg-zinc-800 f-transition-colors"
        >
          {index + 1}
        </a>
      ))}
    </div>
  );

  return (
    <div className="f-absolute f-w-full f-h-full f-bg-red-700/5 f-flex f-justify-end f-items-end f-top-0">
      {isOpen ? (
        <div className="f-w-full f-h-full f-flex f-justify-center f-transition-all f-duration-300 f-ease-in-out f-p-5 f-bg-zinc-950/20 f-backdrop-blur-[4px]">
          <div className="f-w-full f-flex f-flex-col f-items-center f-pt-12">
            <div
              onClick={() => setIsOpen(true)}
              className={`f-flex f-w-full f-max-w-[700px] f-h-14 f-bg-zinc-950 f-rounded-md f-overflow-hidden f-z-10 f-border f-border-zinc-600`}
            >
              <div className="f-flex f-justify-center f-items-center f-py-2 f-px-3">
                <SearchIcon />
              </div>
              {/*@ts-ignore */}
              <form className="f-w-full f-h-full " action={handleSubmit}>
                <input
                  autoFocus={true}
                  autoComplete="off"
                  placeholder="Ask anything"
                  className="f-w-full f-h-full f-transition-all f-duration-300 f-outline-none f-bg-zinc-950 fh-full f-p-3 f-text-white"
                  type="text"
                  name="search"
                  style={{ opacity: isOpen ? 1 : 0 }}
                />
              </form>
              <div className="f-flex f-justify-center f-items-center f-px-2">
                <button
                  onClick={async () => {
                    await new Promise((resolve) => setTimeout(resolve, 0));
                    setIsOpen(false);
                  }}
                  className="f-py-1 f-px-2 f-zn f-rounded-md f-text-zinc-400 hover:f-border-red-500 f-transition-colors f-duration-200 f-cursor-pointer"
                >
                  Esc
                </button>
              </div>
            </div>
            <div className="f-w-full f-flex f-justify-center">
              <div
                className={`f-w-full f-mt-2 f-rounded-md f-max-w-[700px] f-zn f-bg-zinc-950 f-overflow-y-auto f-transition-all f-duration-500 f-ease-in-out ${
                  isLoading || response
                    ? "f-min-h-[80px] f-max-h-[400px] sm:f-p-3 f-p-2 f-block"
                    : "f-h-0 f-hidden"
                }`}
              >
                {(isLoading || response) && (
                  <div
                    className={`f-rounded-lg f-p-3 f-leading-7 f-font-sans f-flex-grow ${
                      response === "Loading..."
                        ? "f-text-zinc-400"
                        : "f-text-zinc-400"
                    }`}
                  >
                    {response.split("<-$#$->")[0]}
                    {isLoading && (
                      <span className="f-inline-block f-w-2 f-h-4 f-bg-white f-ml-1"></span>
                    )}
                  </div>
                )}
                {!isLoading && referenceLinks.length > 0 && (
                  <ReferenceLinks links={referenceLinks} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="f-p-5 f-group ">
          <button
            title="ctrl + k"
            onClick={() => {
              setIsOpen(true);
            }}
            className=" f-bg-zinc-950 f-p-4 f-border f-border-zinc-700 hover:f-border-blue-600 f-transition-color f-duration-300 f-rounded-full"
          >
            <SparkleIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
