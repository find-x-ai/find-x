"use client";
import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, SparkleIcon, TextIcon } from "./icons/svgs";
import { ResponseWithCodeSnippets, Sources } from "./ui";

const ChatBox = ({ findx_key }: { findx_key: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [referenceLinks, setReferenceLinks] = useState<string[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<string[]>([]);

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

  const typeEffect = async (
    text: string,
    setResponse: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const words = text.split(" ");
    for (let i = 0; i < words.length; i++) {
      setResponse((prev) => prev + (i === 0 ? "" : " ") + words[i]);
      await new Promise((resolve) => setTimeout(resolve, 10)); // Adjust delay as needed
    }
  };

  const extractCodeSnippets = (text: string) => {
    const regex = /```(?:\w*\n)?([\s\S]*?)```/g;
    const snippets: string[] = [];
    let index = 0;
    const processedText = text.replace(regex, (_match, code) => {
      snippets.push(code.trim());
      return `<CODE_SNIPPET_${index++}>`;
    });
    return { snippets, processedText };
  };

  const handleSubmit = async (formData: FormData) => {
    const search = formData.get("search") as string;
    (document.querySelector("form") as HTMLFormElement).reset();
    if (!search.trim() || isLoading) return;
    await new Promise((resolve) => setTimeout(resolve, 0));
    setIsLoading(true);
    setResponse("Searching");
    setReferenceLinks([]);
    setCodeSnippets([]);

    try {
      const res = await fetch("https://server.find-x.workers.dev/query", {
        method: "POST",
        cache: "force-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${findx_key}`,
        },
        body: JSON.stringify({
          query: search,
        }),
      });
      setSearchQuery(search);

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
      let links: string[] = [];
      setResponse(""); // Clear the previous response

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        wholeResponse += chunk;

        // Process chunks as they come
        if (chunk.includes("<#$#>")) {
          const [responseText, linksText] = chunk.split("<#$#>");
          if (linksText) {
            links = [
              ...links,
              ...linksText.split("<*$*>").map((link) => link.trim()),
            ];
          }
          setReferenceLinks(links);

          // Type out the response text
          await typeEffect(responseText, setResponse);
        } else {
          // If there's no link separator, type out the whole chunk
          await typeEffect(chunk, setResponse);
        }
      }

      // Extract code snippets from the whole response at the end
      const { snippets, processedText } = extractCodeSnippets(wholeResponse);
      setCodeSnippets(snippets);
      setResponse(processedText);
    } catch (error) {
      console.log(error);
      setResponse("Failed to fetch response!");
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div>
      {isOpen ? (
        <div className="f-w-full f-fixed  f-h-full  f-transition-all f-duration-300 f-ease-in-out f-p-5 f-bg-zinc-950/90 f-overflow-hidden f-top-0 .f-backdrop-blur-[4px] f-z-[100]">
          <div
            ref={uiRef}
            className="f-w-full f-h-auto f-mx-auto f-max-w-[800px] f-relative f-top-10 "
          >
            <div
              className={`f-flex f-w-full f-h-14 f-bg-zinc-900 f-rounded-md f-overflow-hidden f-z-10 f-border f-border-zinc-800/90`}
            >
              <div className="f-flex f-justify-center f-items-center f-py-2 f-px-3">
                <SearchIcon />
              </div>
              {/*@ts-ignore */}
              <form className="f-w-full f-h-full " action={handleSubmit}>
                <input
                  autoFocus={true}
                  autoComplete="off"
                  placeholder="Search anything"
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
            <div className="f-w-full f-flex f-justify-center f-relative">
              <div
                className={`f-w-full f-mt-2 f-rounded-md f-max-w-[800px] f-border f-border-zinc-800/90 f-bg-zinc-900 f-scrollbar-hide f-overflow-auto f-transition-all f-duration-500 f-ease-in-out ${
                  isLoading || response
                    ? "f-min-h-[80px] sm:f-max-h-[550px] f-max-h-[550px] f-block"
                    : "f-h-0 f-hidden"
                }`}
              >
                {(isLoading || response) && (
                  <div
                    className={`f-rounded-lg f-p-5 f-leading-7 f-font-sans f-flex-grow ${
                      response === "Searching"
                        ? "f-text-zinc-400 f-flex f-gap-7 f-items-center"
                        : "f-text-zinc-200"
                    }`}
                  >
                    <div
                      className={`lds-grid ${
                        response === "Searching" ? "f-block f-pl-3" : "f-hidden"
                      }`}
                    >
                      <span
                        className={`loader f-scale-95 f-transition-colors f-duration-300 f-text-blue-500`}
                      ></span>
                    </div>
                    {response !== "Searching" && response !== "Analyzing" ? (
                      <>
                        <div className="f-flex f-flex-col">
                          <h1 className="md:f-text-3xl f-text-2xl f-text-zinc-100 f-pb-5 f-pt-0">
                            {searchQuery.slice(0, 100)}
                          </h1>{" "}
                          <Sources links={referenceLinks} />
                          <div className="f-py-3 f-text-lg f-text-amber-400 f-flex f-items-center f-gap-2">
                            <TextIcon />
                            <h2>AI response</h2>
                          </div>
                        </div>
                        <ResponseWithCodeSnippets
                          text={response.split("<#$#>")[0]}
                          snippets={codeSnippets}
                        />
                      </>
                    ) : (
                      <>{response}</>
                    )}
                  </div>
                )}
                <div className="f-flex f-justify-between f-items-center f-sticky f-bottom-[-1px] f-z-20 f-right-0 f-bg-zinc-900 sm:f-p-3 f-p-2 f-h-[50px]">
                  <span className="f-px-5 f-text-sm f-text-zinc-500 f-ml-auto f-tracking-wider">
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
