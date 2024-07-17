"use client";
import { motion } from "framer-motion";
export const WeMakeDifference = () => {
  return (
    <motion.div
      initial={{ scale: 0.5 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      className="border border-zinc-800 p-10 rounded-lg shadow-sm bg-zinc-800"
    >
      <div>
        <h1 className="text-5xl sm:text-6xl md:text-8xl flex flex-col gap-3 tracking-wider text-zinc-100">
          {" "}
          <span> We </span>
          <span>Make</span>
          <span> Difference.</span>
        </h1>
      </div>
    </motion.div>
  );
};
