import React from "react";
import { TextIcon } from "../icons/svgs";
import { ResponseWithCodeSnippets, Sources } from "../ui";

type ResponseAreaProps = {
  isLoading: boolean;
  response: string;
  searchQuery: string;
  referenceLinks: string[];
  codeSnippets: string[];
};

export const ResponseArea: React.FC<ResponseAreaProps> = ({
  isLoading,
  response,
  searchQuery,
  referenceLinks,
  codeSnippets,
}) => (
  <div className="f-w-full f-flex f-justify-center f-relative f-font-[sans-serif]">
    <div
      className={`f-w-full f-mt-2 f-rounded-md f-max-w-[800px] f-border f-border-zinc-800/90 f-bg-zinc-100 f-scrollbar-hide f-overflow-auto f-transition-all f-duration-500 f-ease-in-out ${
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
          {response !== "Searching" ? (
            <>
              <div className="f-flex f-flex-col">
                <h1 className="md:f-text-xl f-text-lg f-text-[#132121] f-font-medium f-pb-5 f-pt-0">
                  {searchQuery.slice(0, 100)}
                </h1>{" "}
                <Sources links={referenceLinks} />
                <div className="f-py-3 f-text-lg f-text-[#273734] f-flex f-items-center f-gap-2">
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
            <p className="f-text-[#273734] f-font-medium">{response}</p>
          )}
        </div>
      )}
      <div className="f-flex f-justify-between f-items-center f-sticky f-bottom-[-1px] f-z-20 f-right-0 f-bg-zinc-100 sm:f-p-3 f-p-2 f-h-[50px]">
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
);
