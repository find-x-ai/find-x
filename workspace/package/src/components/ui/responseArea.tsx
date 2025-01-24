import React from "react";
import { RegenerateIcon, TextIcon } from "../icons/svgs";
import { ResponseWithCodeSnippets, Sources } from "../ui";
import { Image, Source } from "../types";
import { Images } from "./images";

type ResponseAreaProps = {
  isLoading: boolean;
  response: string;
  sources: Source[];
  codeSnippets: string[];
  theme: "light" | "dark";
  images: Image[];
  handleRegenerate: () => Promise<void>;
};

export const ResponseArea: React.FC<ResponseAreaProps> = ({
  isLoading,
  response,
  sources,
  codeSnippets,
  theme,
  images,
  handleRegenerate,
}) => (
  <div className="f-w-full f-flex f-justify-center f-relative f-font-[sans-serif]">
    <div
      className={`f-w-full f-mt-2 f-rounded-md f-max-w-[800px] ${
        theme === "light" ? "f-bg-zinc-100" : "f-bg-[#191a1a]"
      } f-scrollbar-hide f-overflow-y-auto f-overflow-x-hidden f-transition-all f-duration-500 f-ease-in-out ${
        isLoading || response
          ? "f-min-h-[80px] sm:f-max-h-[550px] f-max-h-[550px] f-block"
          : "f-h-0 f-hidden"
      }`}
    >
      {(isLoading || response) && (
        <div
          className={`f-rounded-lg f-p-5 f-leading-7 f-font-sans f-flex-grow ${
            response === "Searching" && `f-flex f-gap-4 f-items-center`
          }`}
        >
          <div
            className={`lds-grid ${
              response === "Searching" ? "f-block f-pl-3" : "f-hidden"
            }`}
          >
            <div className={`${theme === "light" ? "loader-fx-light" : "loader-fx-dark"}`}></div>
          </div>
          {response !== "Searching" ? (
            <>
              <div className="f-flex f-flex-col">
                <Sources sources={sources} theme={theme} />
                <div
                  className={`f-py-3 f-text-lg ${
                    theme === "light" ? "f-text-[#273734]" : "f-text-white"
                  }  f-flex f-items-center f-gap-2 f-justify-between`}
                >
                  <div className="f-flex f-items-center f-gap-2">
                    <TextIcon theme={theme} />
                    <p>AI response</p>
                  </div>
                  <div className="f-px-2">
                    <div
                      onClick={handleRegenerate}
                      title="Regenerate"
                      className="f-border-2 f-border-transparent hover:f-opacity-80 f-duration-1000 f-rounded-full f-cursor-pointer hover:f-transition-transform f-transition-all hover:f-rotate-90"
                    >
                      <RegenerateIcon theme={theme} />
                    </div>
                  </div>
                </div>
              </div>
              {images.length > 0 ? (
                <div className="f-pb-5 f-pt-3">
                  <Images theme={theme} images={images} />
                </div>
              ) : (
                ""
              )}
              <ResponseWithCodeSnippets
                text={response.split("<#$#>")[0]}
                snippets={codeSnippets}
                theme={theme}
              />
            </>
          ) : (
            <p
              className={`${
                theme === "light" ? "f-text-[#273734]" : "f-text-neutral-400"
              } f-font-medium`}
            >
              {response}
            </p>
          )}
        </div>
      )}
      <div
        className={`f-flex f-justify-between f-items-center f-sticky f-bottom-[-1px] f-z-20 f-right-0 ${
          theme === "light"
            ? "f-bg-zinc-100 f-text-zinc-500"
            : "f-bg-[#191a1a] f-text-neutral-500"
        } sm:f-p-3 f-p-2 f-h-[50px]`}
      >
        <span className="f-px-5 f-text-sm f-ml-auto f-tracking-wider">
          Powered by{" "}
          <a
            target="blanc"
            href="https://find-x.tech/"
            className=" f-underline"
          >
            find-x
          </a>
        </span>
      </div>
    </div>
  </div>
);
