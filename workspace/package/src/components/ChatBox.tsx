"use client";

import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, SparkleIcon } from "./icons/svgs";
import { getEnvSecret } from "../actions/stream";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);

  const uiRef = useRef<HTMLDivElement>(null);

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const typeEffect = async (text: string) => {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      setResponse(words.slice(0, i + 1).join(" "));
      await new Promise((resolve) => setTimeout(resolve, 30)); 
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const search = formData.get("search") as string;
    if (!search.trim() || isLoading) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
    setIsLoading(true);
    setResponse("Loading...");
    setReferenceLinks([]);

    const res = await fetch("https://server.find-x.workers.dev/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getEnvSecret()}`,
      },
      body: JSON.stringify({
        query: search,
      }),
    });

    if (!res.body) {
      setIsLoading(false);
      setResponse("Failed to load response!");
      return;
    }

    const decoder = new TextDecoder();
    const reader = res.body.getReader();

    if (!reader) {
      setIsLoading(false);
      setResponse("Failed to load response!");
      return;
    }

    let wholeResponse = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      wholeResponse += chunk;
      await typeEffect(wholeResponse);
    }

    // Extract the response and reference links
    const [responseText, linksText] = wholeResponse.split("<#$#>");
    const links = linksText
      ? linksText.split(",").map((link) => link.trim())
      : [];

    // Update states
    setResponse(responseText.trim());
    setReferenceLinks(links);

    setIsLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uiRef.current && !uiRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
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
          className="f-px-2 f-w-[25px] f-h-[25px] f-flex f-justify-center f-items-center f-text-xs f-py-1 f-bg-zinc-900 f-text-zinc-200 f-rounded-full f-border f-border-zinc-700 hover:f-bg-zinc-800 f-transition-colors"
        >
          {index + 1}
        </a>
      ))}
    </div>
  );

  return (
    <div>
      {isOpen ? (
        <div className="f-w-full f-fixed  f-h-full  f-transition-all f-duration-300 f-ease-in-out f-p-5 f-bg-zinc-950/90 f-overflow-hidden f-top-0 f-backdrop-blur-[4px] f-z-[100]">
          <div
            ref={uiRef}
            className="f-w-full f-h-auto f-max-h-[350px] f-mx-auto f-max-w-[700px] f-relative f-top-10 "
          >
            <div
              onClick={() => setIsOpen(true)}
              className={`f-flex f-w-full f-h-14 f-bg-zinc-950 f-rounded-md f-overflow-hidden f-z-10 f-border f-border-zinc-800/90`}
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
                  className="f-w-full f-h-full f-transition-all f-duration-300 f-outline-none f-bg-transparent fh-full f-p-3 f-text-white"
                  type="text"
                  name="search"
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
                className={`f-w-full f-mt-2 f-scrollbar-hide f-rounded-md f-max-w-[700px] f-border f-border-zinc-800/90 f-bg-zinc-950 f-overflow-y-auto f-transition-all f-duration-500 f-ease-in-out ${
                  isLoading || response
                    ? "f-min-h-[80px] f-max-h-[500px] sm:f-p-3 f-p-2 f-block"
                    : "f-h-0 f-hidden"
                }`}
              >
                {(isLoading || response) && (
                  <div
                    className={`f-rounded-lg f-p-3 f-leading-7 f-font-sans f-flex-grow ${
                      response === "Loading..."
                        ? "f-text-zinc-400"
                        : "f-text-zinc-200"
                    }`}
                  >
                    {response.split("<#$#>")[0]}
                    {isLoading && (
                      <span className="f-inline-block f-w-2 f-h-4 f-bg-white f-ml-1 f-animate-blink"></span>
                    )}
                  </div>
                )}
                <div className="f-flex f-justify-between f-items-center">
                  {!isLoading && referenceLinks.length > 0 && (
                    <ReferenceLinks links={referenceLinks} />
                  )}
                  <span className="f-px-5 f-text-sm f-ml-auto f-text-zinc-500">
                    Powered by{" "}
                    <a
                      target="blanc"
                      href="https://findx.vercel.app/"
                      className=" f-underline"
                    >
                      find-x
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="f-p-5 f-group f-fixed f-bottom-2 f-right-2">
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
