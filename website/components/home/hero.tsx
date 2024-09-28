"use client";
import Link from "next/link";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export const Hero = ({ version }: { version: string }) => {
  return (
    <motion.div
      initial={{ y: -10, filter: "blur(5px)", opacity: 0 }}
      whileInView={{ y: 0, filter: "blur(0px)", opacity: 1 }}
      viewport={{ once: true }}
      className="w-full max-w-[1200px] text-center flex flex-col gap-5 mx-auto py-10"
    >
      <div className="flex flex-col items-center gap-5">
        <Link target="_blank" href={'https://www.npmjs.com/package/find-x-ai'} className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
            <span>Just released {version}</span>
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.75 8.75L14.25 12L10.75 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </Link>
        <h1 className=" text-5xl sm:text-6xl  text-[#f7f8f8] tracking-tighter leading-[1.1]">
          The most comprehensive <br />
          <span className="gradient-text"> AI search</span> for web
        </h1>
        <p className="text-[#b3b4b4] text-lg">
          Upgrade your default search and search better with Find-X.
        </p>
      </div>
      <div className="flex sm:flex-row  gap-5 items-center justify-center">
        <Link href={'/dashboard'} className="py-2 px-5 w-full sm:w-auto bg-white shadow-[0px_0px_200px_#059669]-  rounded-md text-black">
          Get started
        </Link>
        <Link
          className="border sm:w-auto w-full border-[#232424] py-2 px-5 rounded-md text-white flex items-center justify-center group"
          href={"/docs/getting_started"}
        >
          Documentation
        </Link>
      </div>
    </motion.div>
  );
};
