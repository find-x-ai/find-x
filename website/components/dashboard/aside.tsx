"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileSearch,
  Settings,
  Receipt,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar({
  session,
}: {
  session: {
    success: boolean;
    message: string;
    data: {
      name: string;
      email: string;
    } | null;
  };
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Indexing", href: "/dashboard/indexing", icon: FileSearch },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: Receipt },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="bg-[#121212] text-white h-screen flex flex-col justify-between border-r border-[#353535]">
      <div className="">
        <div className="py-5 px-3 border-b border-[#353535]">
          <Link className="flex items-center gap-2" href="/dashboard">
            <img src="/logo.png" width={30} height={30} alt="" /> Find-X
          </Link>
        </div>
        <div className="mt-5 px-3 flex flex-col gap-2 ">
          {navItems.map((item, index) => (
            <Link
              className={`flex items-center gap-2 p-3 rounded-md ${
                pathname === item.href ? "bg-gradient-to-r from-emerald-700 to-[#121212]" : "hover:bg-gradient-to-r from-[#202020] to-[#121212]"
              }`}
              key={index}
              href={item.href}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 py-5">
        <div className="flex items-center gap-2 p-3 cursor-pointer rounded-md bg-gradient-to-r from-[#202020] to-[#121212] border border-[#353535]">
          <Avatar>
            <AvatarImage src={"https://vercel.com/api/www/avatar?teamId=team_cPD9Z2E7EcZEXYV62gPV4zug&s=44"} />
            <AvatarFallback className="bg-[#202020] border-2 border-[#353535]">
              {session.data?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{session.data?.name}</p>
            <p className="text-sm text-gray-400">{session.data?.email.split("@")[0].slice(0, 20)+"..."}</p>
          </div>
          <button onClick={async () => await logoutUser()} className="p-2 rounded-md hover:bg-[#202020]">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
