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
    <>
      {text?.length > 0 ? (
        <div className="f-whitespace-pre-wrap f-break-words f-font-sans">
          {parts.map((part, index) => {
            if (part.startsWith("<CODE_SNIPPET_")) {
              const snippetIndex = parseInt(part.match(/\d+/)?.[0] || "0", 10);
              return (
                <div
                  key={`${index}`}
                  className="f-my-2 f-p-2 f-min-h-[45px] f-bg-[#f2f3ed] f-rounded-md f-border f-border-[#273734]/10 f-relative"
                >
                  <div
                    onClick={() =>
                      copyToClipBoard(snippets[snippetIndex], snippetIndex)
                    }
                    className=" f-transition-transform f-duration-500 f-absolute f-top-1 f-right-1 f-z-10 f-bg-[#fcfdf8] f-rounded-md f-border f-border-[#273734]/10 f-cursor-pointer"
                  >
                    {copiedStates[snippetIndex] ? (
                      <TickMarkIcon />
                    ) : (
                      <CopyIcon />
                    )}
                  </div>
                  <pre className="f-text-sm f-text-zinc-800 f-whitespace-pre-wrap f-break-words">
                    <code>{snippets[snippetIndex]}</code>
                  </pre>
                </div>
              );
            }
            return (
              <span className="f-text-[#273734]" key={`${index}`}>
                {part}
              </span>
            );
          })}
          <div ref={endOfResponseRef} className="sm:f-block f-hidden" />
        </div>
      ) : (
        <>
          <div className=" f-flex f-flex-col f-gap-2">
            {" "}
            <div className="f-w-[40%] f-mb-3 f-h-4 f-rounded-full f-bg-[#e7e8e2] f-animate-pulse"></div>{" "}
            {[...Array(3)].map((_ele, i) => (
              <div
                key={i}
                className="f-w-full f-h-4 f-rounded-full f-bg-[#e7e8e2] f-animate-pulse"
              ></div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export { ResponseWithCodeSnippets };
