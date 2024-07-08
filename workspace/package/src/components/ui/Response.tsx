import React, { useEffect, useRef, useState } from "react";
import { CopyIcon, TickMarkIcon } from "../icons/svgs";

const ResponseWithCodeSnippets = ({
  text,
  snippets,
}: {
  text: string;
  snippets: string[];
}) => {
  const [copiedStates, setCopiedStates] = useState<boolean[]>(
    new Array(snippets.length).fill(false)
  );

  const endOfResponseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfResponseRef.current) {
      endOfResponseRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
    <div className="f-whitespace-pre-wrap f-break-words f-font-sans">
      {parts.map((part, index) => {
        if (part.startsWith("<CODE_SNIPPET_")) {
          const snippetIndex = parseInt(part.match(/\d+/)?.[0] || "0", 10);
          return (
            <div
              key={`${index}`}
              className="f-my-2 f-p-2 f-bg-zinc-900/40 f-rounded-md f-border f-border-zinc-800 f-relative"
            >
              <div
                onClick={() =>
                  copyToClipBoard(snippets[snippetIndex], snippetIndex)
                }
                className=" f-transition-transform f-duration-500 f-absolute f-top-1 f-right-1 f-z-10 f-bg-zinc-950 f-rounded-md f-border f-border-zinc-800 f-cursor-pointer"
              >
                {copiedStates[snippetIndex] ? <TickMarkIcon /> : <CopyIcon />}
              </div>
              <pre className="f-text-sm f-text-zinc-200 f-whitespace-pre-wrap f-break-words">
                <code>{snippets[snippetIndex]}</code>
              </pre>
            </div>
          );
        }
        return (
          <span key={`${index}`}>
            {part}
          </span>
        );
      })}
      <div ref={endOfResponseRef} className="sm:f-block f-hidden"/>
    </div>
  );
};

export { ResponseWithCodeSnippets };
