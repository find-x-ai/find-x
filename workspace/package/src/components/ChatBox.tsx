"use client";
import React, { useState, useEffect, useRef } from "react";
import { ResponseArea, SearchBar, SparkleButton } from "./ui";
import { useTypeEffect } from "./hooks/useTypeEffect";
import { useExtractCodeSnippets } from "./hooks/useExtractCodeSnippets";
import { fetchResponse } from "../actions/fetch";
import { Config, Header, Image, Source } from "./types";

const ChatBox = ({ config }: { config: Config }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [sources, setSources] = useState<Source[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<string[]>([]);
  const [images, setImages] = useState<Image[]>([]);

  const uiRef = useRef<HTMLDivElement>(null);
  const typeEffect = useTypeEffect();
  const extractCodeSnippets = useExtractCodeSnippets();

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

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

  const handleSubmit = async (formData: FormData) => {
    const search = formData.get("search") as string;
    if (!search.trim() || isLoading) return;
    (document.querySelector("form") as HTMLFormElement).reset();
    await new Promise((res) => setTimeout(res, 0)); // Dummy await for react state updates
    setIsLoading(true);
    setResponse("Searching");
    setSources([]);
    setCodeSnippets([]);
    setImages([]);

    try {
      const responseStream = await fetchResponse(search, config.findx_key);
      let wholeResponse = "";
      setResponse(""); // Clear the previous response

      for await (const chunk of responseStream) {
        if (chunk.includes("<#$#>")) {
          // split the text to extract the header JSON string
          const [headerString, responseText] = chunk.split("<#$#>");
          const header = JSON.parse(headerString) as Header;
          setImages(header.images.data);
          wholeResponse += responseText;
          setSources(header.sources);
          await typeEffect(responseText, setResponse);
        } else {
          wholeResponse += chunk;
          await typeEffect(chunk, setResponse);
        }
      }

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

  return (
    <div className="find-x">
      {isOpen ? (
        <div className="f-w-full f-font-[sans-serif] f-fixed f-h-full f-transition-all f-duration-300 f-ease-in-out f-p-5 f-bg-zinc-950/90 f-overflow-hidden f-top-0 f-z-[100]">
          <div
            ref={uiRef}
            className="f-w-full f-h-auto f-mx-auto f-max-w-[800px] f-relative f-top-10"
          >
            <SearchBar
              handleSubmit={handleSubmit}
              setIsOpen={setIsOpen}
              theme={config.theme}
            />
            <ResponseArea
              isLoading={isLoading}
              response={response}
              sources={sources}
              codeSnippets={codeSnippets}
              theme={config.theme}
              images={images}
            />
          </div>
        </div>
      ) : (
        <SparkleButton setIsOpen={setIsOpen} />
      )}
    </div>
  );
};

export default ChatBox;
