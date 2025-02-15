"use client";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { ResponseArea, SearchBar, SparkleButton, Suggestions } from "./ui";
import { useTypeEffect } from "./hooks/useTypeEffect";
import { useExtractCodeSnippets } from "./hooks/useExtractCodeSnippets";
import { fetchResponse } from "../actions/fetch";
import { Config, Header, Image, Source } from "./types";

let externalToggle: (() => void) | null = null;

export const toggleChatBox = () => {
  if (externalToggle) {
    externalToggle();
  } else {
    console.warn("ChatBox has not been initialized yet.");
  }
};

const useChatBoxState = (): [
  boolean,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);
  return [isOpen, toggleOpen, setIsOpen];
};

const ChatBox = ({ config }: { config: Config }) => {
  const [isOpen, toggleOpen, setIsOpen] = useChatBoxState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [sources, setSources] = useState<Source[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<string[]>([]);
  const [images, setImages] = useState<Image[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const uiRef = useRef<HTMLDivElement>(null);
  const typeEffect = useTypeEffect();
  const extractCodeSnippets = useExtractCodeSnippets();

  // Use a ref to persist the backup query across renders
  const searchQueryBackup = useRef<string>("");

  useEffect(() => {
    externalToggle = toggleOpen;
    return () => {
      externalToggle = null;
    };
  }, [toggleOpen]);

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
  }, [setIsOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim() || isLoading) return;
    // Backup the current query
    searchQueryBackup.current = searchQuery;
    // Reset the search input
    setSearchQuery("");
    setIsLoading(true);
    setResponse("Searching");
    setSources([]);
    setCodeSnippets([]);
    setImages([]);

    try {
      const responseStream = await fetchResponse(
        searchQuery,
        config.findx_key,
        true
      );
      let wholeResponse = "";
      setResponse(""); // Clear the previous response

      for await (const chunk of responseStream) {
        if (chunk.includes("<#$#>")) {
          // Split the text to extract the header JSON string
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

  const handleRegenerate = async () => {
    // Use the backup query instead of the now reset searchQuery
    if (!searchQueryBackup.current.trim() || isLoading) return;
    setIsLoading(true);
    setResponse("Regenerating...");

    try {
      const responseStream = await fetchResponse(
        searchQueryBackup.current,
        config.findx_key,
        false
      );
      setResponse(" ");
      let wholeResponse = "";

      for await (const chunk of responseStream) {
        if (chunk.includes("<#$#>")) {
          const [_headerString, responseText] = chunk.split("<#$#>");
          wholeResponse += responseText;
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
    <div className="find-x f-text-start">
      {isOpen && (
        <div
          className={`f-w-full f-font-[sans-serif] f-fixed f-h-full f-transition-all f-duration-300 f-ease-in-out f-p-5 f-backdrop-blur-md ${
            config.theme === "dark" ? "f-bg-zinc-200/30" : "f-bg-zinc-950/30 "
          } -f-backdrop-blur-[3px] f-overflow-hidden f-top-0 f-right-0 f-z-[100]`}
        >
          <div
            ref={uiRef}
            className="f-w-full f-h-auto f-mx-auto f-max-w-[800px] f-relative f-top-10"
          >
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSubmit={handleSubmit}
              setIsOpen={setIsOpen}
              theme={config.theme}
            />
            {response.length > 0 && searchQuery.length <= 0 ? (
              <ResponseArea
                isLoading={isLoading}
                response={response}
                sources={sources}
                codeSnippets={codeSnippets}
                theme={config.theme}
                images={images}
                handleRegenerate={handleRegenerate}
              />
            ) : (
              config.suggestions && (
                <Suggestions
                  suggestions={config.suggestions}
                  theme={config.theme}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSubmit={handleSubmit}
                />
              )
            )}
          </div>
        </div>
      )}
      {config.default && <SparkleButton setIsOpen={setIsOpen} />}
    </div>
  );
};

export default ChatBox;
