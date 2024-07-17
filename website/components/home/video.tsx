"use client";
import { motion } from "framer-motion";
export const Video = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, filter: "blur(5px)", scale: 0.7 }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      exit={{scale:0.8}}
    >
      <div className="w-full">
        <div className="relative w-full pt-[56.25%] overflow-hidden rounded-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/dNVZFkMcehg?autoplay=1&loop=1&controls=0&playlist=dNVZFkMcehg&mute=1"
            title="YouTube video"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
};
