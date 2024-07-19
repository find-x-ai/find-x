"use client";
import React, { useState } from "react";
import { ShevronDownIcon } from "../icons/svgs";

export const Sources = ({ links }: { links: string[] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      {links && (
        <>
          {links.length > 0 ? (
            <div
              className={`f-bg-zinc-950/40 f-w-full f-group ${
                isOpen
                  ? "sm:f-h-[205px] f-h-[130px]"
                  : "f-h-[60px] hover:f-border-zinc-900"
              } f-border f-border-zinc-800 f-rounded-md f-flex f-flex-col f-transition-all f-duration-300 f-overflow-hidden`}
            >
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="f-flex f-cursor-pointer"
              >
                <div className="f-w-full f-h-[60px] f-flex f-justify-start f-items-center f-p-3">
                  <h2 className="f-p-2">Sources</h2>
                </div>

                <div className="f-w-full f-h-[60px] f-flex f-justify-end f-items-center f-p-3">
                  <ShevronDownIcon
                    className={`f-stroke-zinc-700 group-hover:f-stroke-zinc-500 ${
                      isOpen && "f-transform f-rotate-180"
                    } f-transition-transform f-duration-300`}
                  />
                </div>
              </button>

              <div className={`f-p-3 f-flex f-gap-5 f-h-full`}>
                {links
                  .filter((link) => link.trim() !== "")
                  .map((link, i) => {
                    const [url, content] = link.split("#");
                    const arr = url.split("/");
                    const title = arr[arr.length - 1] || "Home";

                    return (
                      <div
                        key={i}
                        className="f-flex f-relative f-gap-1 f-text-sm f-flex-col sm:f-justify-start f-justify-center f-items-center sm:f-items-start f-border sm:f-border-zinc-900 f-border-zinc-800 f-w-full sm:f-h-[120px] md:f-h-[120px] f-h-[40px] f-overflow-hidden f-p-2 f-text-zinc-400 f-rounded-md"
                      >
                        <a
                          target="_blanc"
                          className="f-text-zinc-200"
                          href={url}
                        >
                          {title}
                        </a>
                        {content && (
                          <div className="f-group">
                            <a
                              className="sm:f-block f-hidden"
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {content.length > 80
                                ? `${content.slice(0, 80)}...`
                                : content}
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="f-w-full f-h-[60px] f-bg-zinc-950/40 f-rounded-lg f-animate-pulse f-border-zinc-800"></div>
          )}
        </>
      )}
    </>
  );
};
