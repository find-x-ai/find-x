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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toggleChatBox } from "find-x-ai";

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

  return (
    <aside className="w-[300px] bg-[#101010] border-r border-[#202020] text-[#fff] p-6 flex-shrink-0 relative">
      <div className="space-y-5 select-none">
        <div className="flex items-center gap-1 text-sm">
          <img src="/logo.png" alt="Find-X" className="w-6 h-6 rounded-full" />
          <p>
            <span className="pr-3">Find-X</span>|{" "}
            <span className="pl-3 text-[#808080]">Docs</span>
          </p>
          <PanelRight
            onClick={() => {}}
            className="w-5 h-5 text-[#808080] ml-auto cursor-pointer"
          />
        </div>
        <div
          onClick={toggleChatBox}
          className="flex items-center gap-2 bg-[#141414] border border-[#202020] px-3 py-2 rounded-md cursor-pointer"
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
      <div className="mt-10 flex flex-col gap-3 ">
        {links.map((link, i) => (
          <Link href={link.url} key={i}>
            <div
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
      </div>{" "}
    </aside>
  );
};
