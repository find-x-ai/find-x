"use client";
import { motion } from "framer-motion";

export const WeMakeDifference = () => {


  return (
    <motion.div
      initial={{ filter: "blur(5px)", opacity: 0 }}
      whileInView={{ filter: "blur(0px)", opacity: 1 }}
      viewport={{ once: true }}
      className="border border-[#181818] p-10 rounded-lg shadow-sm bg-[#090909]"
    >
      <div>
        <h1 className="text-4xl sm:text-5xl tracking-wider text-center text-[#f1f1f1]">
          {" "}
          <span> Search </span>{" "}
          <span
            className={`gradient-text transition-all duration-500`}
          >
            Better.
          </span>
        </h1>
      </div>
    </motion.div>
  );
};
