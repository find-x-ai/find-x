import React, { useState } from "react";
import { ShevronDownIcon, SourcesIcon } from "../icons/svgs";
import { Source } from "../types";

export const Sources = ({
  sources,
  theme,
}: {
  sources: Source[];
  theme: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      {sources && (
        <>
          {sources.length > 0 ? (
            <div
              className={`${
                theme === "light"
                  ? "f-bg-zinc-200 f-border-[#273734]/10"
                  : "f-bg-[#232525] f-border-neutral-700/40"
              } f-w-full f-group ${
                isOpen ? "f-h-[205px] " : "f-h-[60px]"
              } f-rounded-md f-flex f-flex-col f-transition-all f-duration-200 f-overflow-hidden f-border`}
            >
              <div
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="f-flex f-cursor-pointer f-select-none"
              >
                <div className="f-w-full f-h-[60px] f-flex f-justify-start f-items-center f-p-3">
                  <p
                    className={`${
                      theme === "light"
                        ? "f-text-[#132121]"
                        : " f-text-neutral-200"
                    } f-font-medium f-flex f-gap-2 f-items-center`}
                  >
                    <SourcesIcon theme={theme} isOpen={isOpen} />
                    <span> Sources</span>
                  </p>
                </div>

                <div className="f-w-full f-h-[60px] f-flex f-justify-end f-items-center f-p-3">
                  <ShevronDownIcon
                    className={` ${
                      theme === "light"
                        ? "f-stroke-[#273734]/80 group-hover:f-stroke-[#273734]"
                        : "f-stroke-neutral-200 group-hover:f-stroke-neutral-200/60"
                    } ${
                      isOpen && "f-transform f-rotate-180"
                    } f-transition-transform f-duration-200`}
                  />
                </div>
              </div>

              <div
                className={`f-p-3 f-flex f-flex-row f-gap-3 f-h-full md:f-overflow-hidden f-overflow-x-scroll f-overflow-y-hidden f-scrollbar-hide`}
              >
                {sources.map((source, i) => {
                  return (
                    <div
                      key={i}
                      className={`f-flex md:f-flex-shrink f-shrink-0 f-relative f-gap-1 f-text-sm ${
                        theme === "light"
                          ? "f-text-zinc-600/90 f-bg-zinc-100"
                          : "f-text-neutral-300 f-bg-[#2d2f2f]"
                      }  f-flex-col f-items-start md:f-w-full f-w-[230px] f-h-[120px] f-overflow-hidden f-px-3 f-py-2 f-rounded-md f-transition-all f-duration-200 ${
                        isOpen ? "f-opacity-100" : "f-opacity-0"
                      }`}
                    >
                      <a
                        target="_blanc"
                        className={` f-font-medium f-flex f-gap-2 f-items-center ${
                          theme === "light"
                            ? "f-text-[#273734]"
                            : "f-text-neutral-50"
                        }`}
                        href={source.url}
                      >
                        <span
                          className={`f-text-[9px] f-w-[15px] f-h-[15px] ${
                            theme === "light"
                              ? "f-bg-zinc-800 f-text-white"
                              : "f-bg-neutral-200 f-text-black"
                          } f-flex f-justify-center f-items-center f-rounded-full`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={`${
                            theme === "light"
                              ? "f-text-[#273734]"
                              : "f-text-neutral-50"
                          }`}
                        >
                          {source.title.length < 20
                            ? source.title
                            : source.title.slice(0, 20) + "..."}
                        </span>
                      </a>
                      {source.content && (
                        <div className="f-group f-flex f-gap-2">
                          <span className="f-w-[30px]" />
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" f-flex-wrap"
                          >
                            {source.content}
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className={`f-w-full f-h-[60px] ${
                theme === "light"
                  ? "f-bg-zinc-200 f-border-[#273734]/10"
                  : "f-bg-[#232524] f-border-neutral-700/40"
              } f-rounded-lg f-animate-pulse `}
            ></div>
          )}
        </>
      )}
    </>
  );
};
