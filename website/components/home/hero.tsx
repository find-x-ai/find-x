import { Sparkles } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="flex flex-col gap-5 justify-center items-center h-[calc(100vh-70px)] sm:max-h-[500px] max-h-[400px] p-5">
      <div className="flex flex-col items-center gap-5">
        <h1 className="md:text-7xl sm:text-6xl text-5xl text-center tracking-tight font-medium">
          The most comprehensive AI search for web
        </h1>
        <p>Search for anything, anywhere, instantly.</p>
      </div>
      <div className="flex gap-5">
        <button className="p-3 w-[120px] bg-zinc-800 hover:bg-zinc-900 text-white rounded-full">Get started</button>
        <button className="p-3 w-[120px] bg-zinc-100 hover:bg-zinc-200 border border-zinc-800  rounded-full">Pricing</button>
      </div>
    </div>
  );
};
