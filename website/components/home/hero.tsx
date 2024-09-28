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
      className="w-full max-w-[1200px] flex flex-col gap-5 mx-auto sm:py-10 py-10"
    >
      <div className="flex flex-col gap-5">
        <h1 className=" text-5xl sm:text-6xl text-[#f7f8f8] tracking-wide leading-[1.1]">
          The most comprehensive <br />
          <span className="gradient-text"> AI search</span> for web
        </h1>
        <p className="text-[#b3b4b4]">
          Upgrade your default search and search better with Find-X.
        </p>
      </div>
      <div className="flex sm:flex-row flex-col gap-5 items-center">
        <button className="py-2 px-5 w-full sm:w-auto bg-white shadow-[0px_0px_200px_#059669]-  rounded-md text-black">
          Get started
        </button>
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
