import { Sparkles } from "lucide-react";
export const Hero = () => {
  return (
    <div className="flex shadow-lg relative overflow-hidden z-10 flex-col gap-3 justify-center bg-blue-700 sm:px-16 p-5 rounded-lg h-[500px]">
      <div className="">
        <h1 className="sm:text-8xl md:text-7xl text-6xl text-white">
          The fastest <br /> AI search engine.
        </h1>
      </div>
      <div className="text-white">
        <p className="text-md">Search for anything, anywhere, instantly.</p>
      </div>
      <div className="absolute right-[-8px] bottom-[-8px]">
        <video
          width={500}
          style={{ transform: "rotate(180deg)", mixBlendMode: "lighten" }}
          loop={true}
          autoPlay={true}
          muted
          src="/hero.mp4"
        ></video>
      </div>
      <div className="flex gap-5 pt-3 z-10">
        <button className="text-white py-4 px-5 bg-zinc-950 rounded-full flex gap-3 shadow-2xl">
          Get started <Sparkles className="text-zinc-300" />
        </button>
      </div>
    </div>
  );
};
