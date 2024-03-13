import Features from "./Features";
import { BackgroundBeams } from "./ui/background-beams";

const Home = () => {
  return (
    <div className="w-full flex flex-col gap-5 justify-start items-center max-w-[1200px] px-2">
      <div className="w-full flex flex-col gap-5 justify-center items-start py-10 px-5 overflow-hidden relative antialiased">
        <div className="text-start p-2 z-20">
          <h1 className="md:text-7xl sm:text-6xl text-5xl font-sans text-[#222] font-bold">
            Lightning Fast <br className="sm:hidden" /> <span className="text-blue-700">AI</span> chat
          </h1>
          <p className="text-zinc-400 pt-5">
            Experience the fastest ai assistance for your app
          </p>
        </div>
        <div className="flex justify-center items-center px-3">
          <button className="px-3 py-2 bg-blue-600 w-[150px] z-10 transition-colors duration-500 font-semibold hover:bg-blue-700 text-[#fff] rounded-sm">
            get sterted
          </button>
        </div>
        <BackgroundBeams className="bg-[#fafafa]"/>
      </div>
      <Features/>
    </div>
  );
};

export default Home;
