"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Submit valid application details",
    description:
      "Please remember that we only accept valid detail requests. Wrong details would reject your request.",
  },
  {
    title: "Data collection",
    description:
      "If your request details are valid, we'll start the process of data collection, which will gather all the publicly available data on your site.",
  },
  {
    title: "Receive API key",
    description:
      "Once all the data present on the website is collected, we'll send you the API key via email.",
  },
  {
    title: "Ready to serve",
    description: "Follow the documentation and you're all set for production.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const Steps = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      className="w-full h-full p-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {steps.map((step, index) => (
        <motion.div
          key={index}
          variants={stepVariants}
          className={`w-full flex gap-5 items-start transition-all duration-500 cursor-pointer ${
            hoveredIndex !== null && hoveredIndex !== index
              ? "md:opacity-30 md:blur-[2px]"
              : ""
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="sm:h-[150px] h-[180px] max-h-[200px] flex flex-col items-center">
            <motion.span
              className={`w-[50px] h-[50px] bg-zinc-200 border-zinc-800 flex justify-center items-center rounded-full border transition-colors duration-300 ${
                hoveredIndex === index &&
                "md:bg-zinc-800 md:text-white md:border-white"
              } z-20`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {index + 1}
            </motion.span>
            {index < steps.length - 1 && (
              <span
                className={`${
                  hoveredIndex === index && "md:opacity-30 md:blur-[1px]"
                } w-2 h-[calc(100%-50px)] bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-400`}
              ></span>
            )}
          </div>
          <motion.div
            className="mt-[10px] flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: index * 0.1 }}
          >
            <h3 className="text-lg font-semibold text-zinc-800">
              {step.title}
            </h3>
            <span className={`border p-2 text-zinc-600 text-sm rounded-lg ${hoveredIndex === index ? "md:shadow-md":"shadow-none"}`}>
              {step.description}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};
