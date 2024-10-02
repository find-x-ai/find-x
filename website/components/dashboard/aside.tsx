"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileSearch, Settings, Receipt } from "lucide-react";
import { Button } from "../ui/button";
import { logoutUser } from "@/actions/auth";

export function Aside() {
  const pathname = usePathname();

  const navItems = [
    { name: "Indexing", href: "/dashboard/indexing", icon: FileSearch },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: Receipt },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-[350px] h-screen bg-[#090909] flex flex-col">
      <div className="flex items-center gap-2 p-6 border-b border-gray-800">
        <img
          width={30}
          height={30}
          src="/logo.png"
          alt="Find-X logo"
          className="rounded-sm"
        />
        <h2 className="text-xl font-semibold text-white">Find-X</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#303030] text-white"
                      : "text-gray-400 hover:bg-[#181818] hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Button onClick={async () => await logoutUser()}>Logout</Button>
    </aside>
  );
}
