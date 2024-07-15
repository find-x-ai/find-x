"use client";
import { useEffect, useState } from "react";

export const Video = () => {
  const [text, setText] = useState<string>("");

  const para =
    "FindX is an AI-powered search engine specifically designed for websites, excelling in the efficient storage and retrieval of publicly available data. By leveraging advanced vector search technology, FindX ensures rapid and accurate access to information, making it exceptionally fast and simple to use. Its seamless integration is particularly beneficial for technical sites, enhancing the resolution of documentation queries and improving the overall user experience.";

  useEffect(() => {
    const TypingEffect = async () => {
      for (let i = 0; i <= para.length; i++) {
        setText(para.slice(0, i));
        await new Promise((res) => setTimeout(res, 5));
      }
    };

    TypingEffect();
  }, []);

  return (
    <div className="flex sm:flex-row flex-col gap-10 py-10">
      <div className="w-full">
        <div className="relative w-full pt-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/KLuTLF3x9sA?autoplay=0&loop=0&controls=1&playlist=KLuTLF3x9sA&mute=1"
            title="YouTube video player"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="w-full flex flex-col gap-5 leading-8 transition-all duration-200">
        <div>
          <h2 className="text-3xl sm:text-start text-center">Demo for web</h2>
        </div>
        <div className="text-zinc-600">{text}</div>
      </div>
    </div>
  );
};
