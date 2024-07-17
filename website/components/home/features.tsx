"use client";
import { motion } from "framer-motion";
export const Features = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(5px)", y: 10 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      className="py-5 flex flex-col gap-5 rounded-lg"
    >
      <div className="text-center">
        <h2 className="md:text-5xl text-4xl">What is it ?</h2>
      </div>
      <div className=" p-5 rounded-lg">
        <p className="w-full max-w-[800px] mx-auto text-zinc-700 leading-7">
          Find-X is the advance search for the modern web apps. We use the top
          tier technologies and techniques to get everything at your fingertips.
          We're here to redefine the default search on your website. It'll make
          sure that your users doesn't suffer on your website.
          <br />
          It efficiently handles all the search queries on your app and presents
          the most relevant information in best possible format.
        </p>
      </div>
      <div className="flex md:flex-row flex-col gap-3 text-zinc-800">
        <div className="w-full text-center p-10 cursor-default border bg-zinc-50 shadow-sm rounded-lg">
          <h2 className="text-lg">Faster response time</h2>
        </div>
        <div className="w-full text-center p-10 cursor-default border bg-zinc-50 shadow-sm rounded-lg">
          <h2 className="text-lg">Efficient search</h2>
        </div>
        <div className="w-full text-center p-10 cursor-default border bg-zinc-50 shadow-sm rounded-lg">
          <h2 className="text-lg">Easy integration</h2>
        </div>
      </div>
    </motion.div>
  );
};
