"use client";

import {
  FileSearch,
  BarChart3,
  Receipt,
  Settings,
  LogOut,
  X,
  AlignJustify,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { logoutUser } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const links = [
  {
    name: "Indexing",
    url: "/dashboard/indexing",
    icon: <FileSearch className="w-5 h-5" />,
  },
  {
    name: "Analytics",
    url: "/dashboard/analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    name: "Billing",
    url: "/dashboard/billing",
    icon: <Receipt className="w-5 h-5" />,
  },
  {
    name: "Settings",
    url: "/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export const Sidebar = ({
  session,
}: {
  session: {
    success: boolean;
    message: string;
    data: {
      name: string;
      email: string;
      id: number;
      session: string;
    } | null;
  };
}) => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false); // Set initial state to true
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width >= 768) {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarClasses = useMemo(
    () => `
    md:w-[300px] align-middle w-full z-20 
    ${isOpen && isMobile ? "h-screen" : "h-[60px] md:h-screen"}
    z-10 fixed md:static top-0 right-0 
    md:bg-[#101010] bg-[#111111]/90 
    md:backdrop-blur-0 backdrop-blur-lg 
    md:border-r border-b border-[#202020] 
    text-[#fff] md:p-6 py-4 px-4 flex-shrink-0
  `,
    [isOpen, isMobile]
  );

  return (
    <aside className={sidebarClasses}>
      <div className="space-y-5 select-none mt-auto">
        <div className="flex items-center gap-1">
          <img src="/logo.png" alt="Find-X" className="w-6 h-6 rounded-full" />
          <p>
            <Link href="/home">
              <span className="pr-3">FIND-X</span>
            </Link>
            |{" "}
            <Link className="pl-3" href="/dashboard">
              <span className="text-[#808080]">Dashboard</span>
            </Link>
          </p>

          <div className="ml-auto">
            {isOpen && isMobile ? (
              <X
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 cursor-pointer text-[#808080] block md:hidden"
              />
            ) : (
              <AlignJustify
                onClick={() => setIsOpen(true)}
                className="w-7 h-7 cursor-pointer text-[#808080] block md:hidden"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 md:gap-0 md:justify-between h-full">
        <div
          className={`mt-10 flex-col gap-3 transition-all duration-300 ${
            isOpen && isMobile ? "flex" : "hidden md:flex"
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
                  path.startsWith(link.url) ? "bg-emerald-700" : "hover:bg-[#141414]"
                }`}
              >
                {link.icon}
                <p>{link.name}</p>
              </div>
            </Link>
          ))}
        </div>
        <div
          className={`flex-row gap-2 py-5 ${
            isOpen && isMobile ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="flex w-full flex-row items-center justify-between p-3 cursor-pointer rounded-md bg-gradient-to-r from-[#202020] to-[#121212] border border-[#353535]">
            <div className="flex items-center gap-2">
              <Avatar className="">
                <AvatarImage
                  src={
                    "https://vercel.com/api/www/avatar?teamId=team_cPD9Z2E7EcZEXYV62gPV4zug&s=44"
                  }
                />
                <AvatarFallback className="bg-[#202020] border-2 border-[#353535]">
                  {session.data?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{session.data?.name}</p>
                <p className="text-sm text-gray-400">
                  {session.data?.email.split("@")[0].slice(0, 20) + "..."}
                </p>
              </div>
            </div>
            <button
              onClick={async () => await logoutUser()}
              className="p-2 rounded-md hover:bg-[#202020]"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
