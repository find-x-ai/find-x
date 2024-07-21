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
              className={`f-bg-[#f2f3ed] f-w-full f-group ${
                isOpen ? "f-h-[205px] " : "f-h-[60px]"
              } f-rounded-md f-flex f-flex-col f-transition-all f-duration-300 f-overflow-hidden f-border f-border-[#273734]/10`}
            >
              <div
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="f-flex f-cursor-pointer f-select-none"
              >
                <div className="f-w-full f-h-[60px] f-flex f-justify-start f-items-center f-p-3">
                  <h2 className="f-p-2 f-text-[#132121] f-font-medium">
                    Sources
                  </h2>
                </div>

                <div className="f-w-full f-h-[60px] f-flex f-justify-end f-items-center f-p-3">
                  <ShevronDownIcon
                    className={`f-stroke-[#273734]/80 group-hover:f-stroke-[#273734] ${
                      isOpen && "f-transform f-rotate-180"
                    } f-transition-transform f-duration-300`}
                  />
                </div>
              </div>

              <div
                className={`f-p-3 f-flex f-flex-row f-gap-5 f-h-full sm:f-overflow-hidden f-overflow-x-scroll f-overflow-y-hidden f-scrollbar-hide`}
              >
                {links
                  .filter((link) => link.trim() !== "")
                  .map((link, i) => {
                    const [url, content] = link.split("#");
                    const arr = url.split("/");
                    const title = arr[arr.length - 1] || "Home";

                    return (
                      <div
                        key={i}
                        className="f-flex md:f-flex-shrink f-shrink-0 f-relative f-gap-1 f-text-sm f-text-[#1f2e29] f-flex-col f-items-start md:f-w-full f-w-[200px] f-h-[120px] f-overflow-hidden f-bg-[#e7e8e2] f-px-4 f-py-2 f-rounded-md"
                      >
                        <a
                          target="_blanc"
                          className="f-text-[#273734] f-font-medium"
                          href={url}
                        >
                          {title}
                        </a>
                        {content && (
                          <div className="f-group">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className=" f-flex-wrap"
                            >
                              {content.length > 80
                                ? `${content.slice(0, 70)}...`
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
            <div className="f-w-full f-h-[60px] f-bg-[#e7e8e2] f-rounded-lg f-animate-pulse f-border-[#273734]/10"></div>
          )}
        </>
      )}
    </>
  );
};
