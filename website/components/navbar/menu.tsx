"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type LinksArray = {
  name: string;
  target: string;
  url: string;
};
const Menu = ({ links }: { links: LinksArray[] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 relative w-[40px] h-[40px]"
      >
        <div
          className={`absolute top-1/2 left-1/2 w-[40px] h-[4px] bg-zinc-700 rounded-full transition-all duration-300 ${
            isOpen
              ? "transform -translate-x-1/2 -translate-y-1/2 rotate-45"
              : "transform -translate-x-1/2 -translate-y-[10px]"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 w-[40px] h-[4px] bg-zinc-700 rounded-full transition-all duration-300 ${
            isOpen
              ? "transform -translate-x-1/2 -translate-y-1/2 -rotate-45"
              : "transform -translate-x-1/2 translate-y-[2px]"
          }`}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="w-full h-[calc(100vh-70px)] absolute z-[100] bg-zinc-100 top-[70px] right-0 flex justify-center items-start py-10"
        >
          <motion.ul
            whileInView={{ opacity: 1 }}
            className="flex flex-col gap-5 text-3xl text-zinc-800 text-center"
          >
            {links.map((link, i) => (
              <motion.li
                key={i}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
              >
                <Link
                  onClick={async () => {
                    await new Promise((res) => setTimeout(res, 300));
                    setIsOpen(false);
                  }}
                  href={link.url}
                  target={link.target}
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </div>
  );
};

export default Menu;
