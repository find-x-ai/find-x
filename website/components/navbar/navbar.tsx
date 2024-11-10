"use client";

import { useState } from "react";
import Link from "next/link";
import { AlignJustify, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const links = [
  { name: "Features", url: "/" },
  { name: "Pricing", url: "/home/pricing" },
  { name: "Team", url: "/home/team" },
  { name: "Company", url: "/" },
  { name: "Blogs", url: "/blogs" },
  { name: "Contact", url: "mailto:team@find-x.tech" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 text-[#f7f8f8] bg-[#101010]/80 backdrop-blur-xl border-b border-[#181818]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            onClick={() => setIsOpen(false)}
            href="/"
            className="flex items-center space-x-1 relative bottom-[2px]"
          >
            <div className="w-6 h-6 bg-primary rounded-full overflow-hidden">
              <img src="/logo.png" alt="Logo" width={32} height={32} />
            </div>
            <span>FIND-X</span>
          </Link>
          <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                className="text-sm font-medium text-muted-foreground hover:text-[#f7f8f8] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:block text-black">
            <Link
              href={"/login"}
              className="w-full px-5 py-1 rounded-md bg-[#f8f9f9] flex justify-center items-center"
            >
              Log in
            </Link>
          </div>
          <div className="md:hidden">
            <div className="ml-auto md:hidden relative bottom-[2px]">
              {isOpen ? (
                <X
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 cursor-pointer text-muted-foreground block md:hidden"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <AlignJustify
                    onClick={() => setIsOpen(true)}
                    className="w-7 h-7 cursor-pointer text-muted-foreground block md:hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden h-screen">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                onClick={() => setIsOpen(false)}
                key={link.name}
                href={link.url}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-[#f7f8f8] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 p-3 text-black">
              <Link
                href={"/login"}
                className="w-full px-5 py-1 rounded-md bg-[#f8f9f9] flex justify-center items-center"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
