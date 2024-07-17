"use client";
import { motion } from "framer-motion";
export const WeMakeDifference = () => {
  return (
    <motion.div
      initial={{ scale: 0.5 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      className="border p-10 rounded-lg shadow-md bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-300"
    >
      <div>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-semibold flex flex-col gap-3 tracking-wider text-zinc-800">
          {" "}
          <span> We </span>
          <span>Make</span>
          <span> Difference.</span>
        </h1>
      </div>
    </motion.div>
  );
};
