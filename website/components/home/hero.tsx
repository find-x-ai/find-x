"use client";
import Link from "next/link";

import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      className="flex flex-col gap-5 justify-center items-center h-[calc(100vh-70px)] sm:max-h-[500px] max-h-[400px]"
    >
      <Link
        href={"/docs"}
        className="py-2 px-3 cursor-pointer rounded-full bg-green-500 text-white text-sm hover:shadow-sm hover:shadow-green-500 transition-shadow duration-500"
      >
        Just released beta -{">"}
      </Link>
      <div className="flex flex-col items-center gap-5">
        <h1 className="md:text-7xl sm:text-6xl text-5xl text-center tracking-tight font-medium">
          The most comprehensive AI search for web
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
