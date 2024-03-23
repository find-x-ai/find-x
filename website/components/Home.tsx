import Link from "next/link";
import Features from "./Features";
import { BackgroundBeams } from "./ui/background-beams";

const Home = () => {
  return (
    <div className="w-full flex flex-col gap-5 justify-start items-center max-w-[1200px] px-5">
      <div className="w-full flex flex-col gap-5 justify-center items-start py-10 overflow-hidden relative antialiased">
        <div className="text-start z-20 h-full">
          <h1 className="md:text-7xl sm:text-6xl text-5xl font-sans text-[#222] font-bold">
            Lightning Fast <br className="sm:hidden" />{" "}
            <span className="text-blue-700">AI</span> chat
          </h1>
          <p className="text-zinc-600 pt-5">
            Experience the fastest ai assistance for your app
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Link className="z-10" href={"/dashboard"}>
            <button className="px-3 py-2 bg-[#0c0c0c] w-[150px]  transition-colors duration-500 font-semibold text-[#fff] rounded-sm">
              get sterted
            </button>
          </Link>
        </div>
        <BackgroundBeams className="bg-[#fafafa]" />
      </div>
      <Features />
    </div>
  );
};

export default Home;
