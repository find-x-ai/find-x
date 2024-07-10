import { Sparkles } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="flex shadow-lg relative overflow-hidden z-10 flex-col gap-3 justify-center bg-blue-700 sm:px-16 p-5 rounded-lg h-[500px]">
      <div className="">
        <h1 className="sm:text-8xl md:text-7xl text-6xl sm:font-bold font-semibold space-x-4 text-white">
          The ultimate AI search <br /> for web apps.
        </h1>
      </div>
      <div className="text-white">
        <p className="text-md">Search for anything, anywhere, instantly.</p>
      </div>
      <div className="absolute right-[-8px] bottom-[-8px]">
        <video
          width={500}
          style={{ transform: "rotate(180deg)", mixBlendMode: "lighten" }}
          autoPlay={true}
          loop
          muted
          src="/hero.mp4"
        ></video>
      </div>
      <div className="flex gap-5 pt-3 z-10">
        <Link
          href={"/request"}
          className="text-white py-4 px-5 bg-zinc-950 rounded-full flex gap-3 shadow-2xl"
        >
          Get started <Sparkles className="text-zinc-300" />
        </Link>
      </div>
    </div>
  );
};
