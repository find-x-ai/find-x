import React, { useEffect, useRef, useState } from "react";
import { CopyIcon, TickMarkIcon } from "../icons/svgs";
//@ts-ignore
import Markdown from "react-markdown";
//@ts-ignore
import remarkGfm from "remark-gfm";

const debounce = (fn: Function, delay: number) => {
  let timeout: any | null = null;
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const ResponseWithCodeSnippets = ({
  text,
  snippets,
  theme,
}: {
  text: string;
  snippets: string[];
  theme: string;
}) => {
  const [copiedStates, setCopiedStates] = useState<boolean[]>(
    new Array(snippets.length).fill(false)
  );

  const endOfResponseRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (endOfResponseRef.current) {
      endOfResponseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const debouncedScrollToBottom = debounce(scrollToBottom, 200);

  useEffect(() => {
    debouncedScrollToBottom();
  }, [text]);

  const copyToClipBoard = async (textToCopy: string, index: number) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = true;
        return newStates;
      });
      await new Promise((res) => setTimeout(res, 1500));
      setCopiedStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[index] = false;
        return newStates;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const parts = text.split(/(<CODE_SNIPPET_\d+>)/);
  return (
    <>
      {text?.length > 0 ? (
        <div className="f-whitespace-pre-wrap f-break-words f-font-sans">
          {parts.map((part, index) => {
            if (part.startsWith("<CODE_SNIPPET_")) {
              const snippetIndex = parseInt(part.match(/\d+/)?.[0] || "0", 10);
              return (
                <div
                  key={`${index}`}
                  className={`f-my-2 ${
                    theme === "light"
                      ? "f-bg-zinc-200 f-border-[#273734]/10"
                      : "f-bg-[#232525] f-border-neutral-700/40"
                  } f-rounded-md f-border f-relative`}
                >
                  <div className="f-absolute f-top-1 f-right-1 f-z-10">
                    <div
                      onClick={() =>
                        copyToClipBoard(snippets[snippetIndex], snippetIndex)
                      }
                      className={` ${
                        theme === "light"
                          ? "f-bg-zinc-100 f-border-[#273734]/20 hover:f-bg-zinc-300"
                          : "f-bg-neutral-900 f-border-neutral-700/40 hover:f-bg-neutral-950"
                      } f-rounded-md f-border f-cursor-pointer`}
                    >
                      {copiedStates[snippetIndex] ? (
                        <TickMarkIcon theme={theme} />
                      ) : (
                        <CopyIcon theme={theme} />
                      )}
                    </div>
                  </div>
                  <div className="f-overflow-x-auto sm:f-overflow-x-hidden f-p-2 f-min-h-[45px]">
                    <pre
                      className={`f-text-sm ${
                        theme === "light"
                          ? "f-text-zinc-600"
                          : "f-text-neutral-300"
                      }  f-whitespace-pre-wrap f-break-words f-min-w-[600px] f-pr-10 find-x-code`}
                    >
                      <code>{snippets[snippetIndex]}</code>
                    </pre>
                  </div>
                </div>
              );
            }
            return (
              <div
                className={`${
                  theme === "light" ? "f-text-[#273734]" : "f-text-neutral-100"
                }`}
                key={`${index}`}
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  className={`f-flex f-flex-col f-gap-2 f-whitespace-pre-wrap f-break-words txt`}
                >
                  {`${part}`}
                </Markdown>
              </div>
            );
          })}
          <div ref={endOfResponseRef} className="sm:f-block f-hidden" />
        </div>
      ) : (
        <>
          <div className="f-flex f-flex-col f-gap-2">
            <div
              className={`f-w-[40%] f-mb-3 f-h-4 f-rounded-full ${
                theme === "light" ? "f-bg-zinc-200" : "f-bg-[#232524]"
              }  f-animate-pulse`}
            ></div>
            {[...Array(3)].map((_ele, i) => (
              <div
                key={i}
                className={`f-w-full f-h-4 f-rounded-full ${
                  theme === "light" ? "f-bg-zinc-200" : "f-bg-[#232524]"
                } f-animate-pulse`}
              ></div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export { ResponseWithCodeSnippets };
