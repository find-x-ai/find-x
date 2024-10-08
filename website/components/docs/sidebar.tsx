"use client";

import {
  Search,
  Book,
  Download,
  Settings,
  Puzzle,
  Command,
  PanelRight,
  ChevronRight,
  AlignJustify,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toggleChatBox } from "find-x-ai";
import { useEffect, useState } from "react";
import React from "react";

const links = [
  {
    name: "Getting Started",
    url: "/docs/getting_started",
    icon: <Book className="w-5 h-5" />,
  },
  {
    name: "Installation",
    url: "/docs/installation",
    icon: <Download className="w-5 h-5" />,
  },
  {
    name: "Setup Instructions",
    url: "/docs/setup",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    name: "Custom Component",
    url: "/docs/custom",
    icon: <Puzzle className="w-5 h-5" />,
  },
];

export const SideBar = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 768);
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside
      className={`md:w-[300px] align-middle w-full ${
        isOpen ? "h-screen" : "h-[60px]"
      } z-10 fixed md:static top-0 right-0 md:bg-[#101010] bg-[#141414]/95 md:backdrop-blur-0 backdrop-blur-lg md:border-r border-b border-[#202020] text-[#fff] md:p-6 py-4 px-4 flex-shrink-0`}
    >
      <div className="space-y-5 select-none mt-auto">
        <div className="flex items-center gap-1">
          <img src="/logo.png" alt="Find-X" className="w-6 h-6 rounded-full" />
          <p>
            <Link href="/home">
              <span className="pr-3">Find-X</span>
            </Link>
            |{" "}
            <Link className="pl-3" href="/docs/getting_started">
              <span className="text-[#808080]">Docs</span>
            </Link>
          </p>

          <div className="ml-auto">
            {isOpen ? (
              <X
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 cursor-pointer text-[#808080] block md:hidden"
              />
            ) : (
              <div className="flex items-center gap-2">
                <Search
                  onClick={toggleChatBox}
                  className="w-6 h-6 text-emerald-700 mr-4 cursor-pointer"
                />

                <AlignJustify
                  onClick={() => setIsOpen(true)}
                  className="w-7 h-7 cursor-pointer text-[#808080] block md:hidden"
                />
              </div>
            )}
          </div>
        </div>

        <div
          onClick={toggleChatBox}
          className="md:flex hidden bg-[#141414] items-center gap-2 border border-[#202020] px-3 py-2 rounded-md cursor-pointer"
        >
          <div>
            <Search className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="w-full text-[#808080]">
            <p>Search Docs...</p>
          </div>
          <div className="flex items-center gap-2 text-[#808080]">
            <Command className="w-7 h-7 bg-[#141414] border border-[#202020] rounded-md p-1" />
            <div className=" w-7 h-7 flex items-center justify-center bg-[#141414] border border-[#202020] rounded-md p-1">
              <kbd>K</kbd>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`mt-10 flex-col gap-3 transition-all duration-300 ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        {links.map((link, i) => (
          <Link href={link.url} key={i}>
            <div
              onClick={async () => {
                await new Promise((res) => setTimeout(res, 300));
                if (isMobile) {
                  setIsOpen(!isOpen);
                }
              }}
              key={i}
              className={`flex items-center gap-2 py-2 px-3 rounded-md  ${
                path === link.url ? "bg-emerald-700" : "hover:bg-[#141414]"
              }`}
            >
              {link.icon}
              <p>{link.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
};
