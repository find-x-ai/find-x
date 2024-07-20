"use client";
import Link from "next/link";

import { motion } from "framer-motion";

export const Hero = ({ version }: { version: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      className="flex flex-col gap-5 justify-center items-center h-[calc(100vh-70px)] sm:max-h-[500px] max-h-[400px]"
    >
      <Link
        target="_blanc"
        href={"https://npmjs.org/find-x-ai"}
        className="py-1 group px-3 cursor-pointer rounded-full border bg-zinc-200 border-zinc-800 text-zinc-800 text-sm"
      >
        Just released {version}{" "}
        <span className="relative group-hover:left-1">-{">"}</span>
      </Link>
      <div className="flex flex-col items-center gap-5">
        <h1 className="md:text-7xl sm:text-6xl text-5xl text-center tracking-tight font-medium">
          The most comprehensive <br /> AI search for web
        </h1>
        <p>Search for anything, anywhere, instantly.</p>
      </div>
      <div className="flex gap-5">
        <button className="p-3 w-[120px] bg-zinc-800 hover:bg-zinc-900 text-white rounded-full">
          Get started
        </button>
        <button className="p-3 w-[120px] bg-zinc-100 hover:bg-zinc-200 border border-zinc-800  rounded-full">
          Pricing
        </button>
      </div>
    </motion.div>
  );
};
