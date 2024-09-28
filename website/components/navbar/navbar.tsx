"use client";
import Link from "next/link";
import { useState } from "react";

const links = [
  { name: "Features", url: "/", target: "_self" },
  { name: "Pricing", url: "/home/pricing", target: "_self" },
  { name: "Team", url: "/home/team", target: "_self" },
  { name: "Company", url: "/", target: "_self" },
  { name: "Blogs", url: "/blogs", target: "_self" },
  { name: "Contact", url: "mailto:team@find-x.tech", target: "_self" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <nav
      className={`w-[95%] z-50 ${
        isOpen ? "h-[500px] bg-[#090909]/95 xl:h-[48px]" : "h-[48px]"
      } overflow-hidden transition-all duration-500 max-w-[1000px] flex flex-col  py-2 px-3 border border-[#232424] bg-[#090909]/80 rounded-xl backdrop-blur-md text-sm fixed top-4 text-[#f7f8f8]`}
    >
      <div className="w-full flex justify-between items-center gap-10">
        <div className="flex items-center gap-1">
          <img
            className="w-[20px] h-[20px] rounded-full"
            src="/logo.png"
            alt=""
          />
          <Link href={"/"}>Find-X</Link>
        </div>
        <div className="gap-10 xl:flex hidden">
          {links.map((link, i) => {
            return (
              <Link key={i} href={link.url} target={link.target}>
                {link.name}
              </Link>
            );
          })}
        </div>
        <div className="xl:flex hidden gap-5">
          <button className="bg-[#323237] py-1 px-3 rounded-md">Log in</button>
          <button className="bg-[#FFFFFF] py-1 px-3 rounded-md text-[#272829]">
            Sign up
          </button>
        </div>
        <div className="xl:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 relative w-[30px] h-[30px] top-[2px]"
          >
            <div
              className={`absolute top-1/2 left-1/2 w-[30px] h-[3px] bg-zinc-700 rounded-full transition-all duration-300 ${
                isOpen
                  ? "transform -translate-x-1/2 -translate-y-1/2 rotate-45"
                  : "transform -translate-x-1/2 -translate-y-[10px]"
              }`}
            />
            <div
              className={`absolute top-1/2 left-1/2 w-[30px] h-[3px] bg-zinc-700 rounded-full transition-all duration-300 ${
                isOpen
                  ? "transform -translate-x-1/2 -translate-y-1/2 -rotate-45"
                  : "transform -translate-x-1/2 translate-y-[2px]"
              }`}
            />
          </button>
        </div>
      </div>
      {/*
         Menu for smaller devices
      */}

      <div className="flex w-dull flex-col gap-10 p-10 items-center justify-start xl:hidden text-lg text-white">
        {links.map((link, i) => {
          return (
            <Link onClick={() => setIsOpen(false)} href={link.url} key={i}>
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
