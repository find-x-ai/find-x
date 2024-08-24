"use client";
import { motion } from "framer-motion";
import { ChevronsUp, Route, TextSearch } from "lucide-react";
export const Features = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)", y: 10 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true }}
      className="p-5 flex flex-col gap-10 rounded-lg border bg-zinc-200"
    >
      <div className="flex md:flex-row flex-col gap-7">
        <div className="w-full">
          <div className="md:text-start text-center py-5">
            <h2 className="md:text-5xl text-4xl text-zinc-700">What is it ?</h2>
          </div>
          <div className="rounded-lg">
            <p className="w-full max-w-[800px] mx-auto text-zinc-700 leading-7">
              Find-X powers lightning-fast, accurate search for modern web apps.
              With cutting-edge technology, we deliver relevant results
              instantly, ensuring your users find exactly what they need without
              hassle. 
              <br />
              <br />
              Upgrade your website’s search and keep your audience
              engaged effortlessly with the speed and functionality like never before.
            </p>
          </div>
        </div>
        <div>
          <img
            className="md:w-[500px] lg:w-[550px] w-full rounded-lg"
            src="/search_hero.png"
            alt="search image"
          />
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-3 text-zinc-200">
        <div className="w-full text-center p-10 cursor-default border border-zinc-800 bg-zinc-800 shadow-sm rounded-lg flex justify-between items-center">
          <h2 className="text-lg tracking-wider">Faster response time</h2>{" "}
          <ChevronsUp className="w-[30px] h-[30px] text-zinc-300" />
        </div>
        <div className="w-full text-center p-10 cursor-default border border-zinc-800 bg-zinc-800 shadow-sm rounded-lg flex justify-between items-center">
          <h2 className="text-lg tracking-wider">Efficient search</h2>{" "}
          <TextSearch className="w-[30px] h-[30px] text-zinc-300" />
        </div>
        <div className="w-full text-center p-10 cursor-default border border-zinc-800 bg-zinc-800 shadow-sm rounded-lg flex justify-between items-center">
          <h2 className="text-lg tracking-wider">Easy integration</h2>{" "}
          <Route className="w-[30px] h-[30px] text-zinc-300" />
        </div>
      </div>
    </motion.div>
  );
};
