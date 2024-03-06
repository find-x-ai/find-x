import { TextGenerateEffect } from "./ui/text-generate";
import Plus from "./Plus";
export default async function Hero() {
  return (
    <div className="w-full h-full px-6 pt-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-[1200px] h-screen sm:max-h-[600px] max-h-[500px] border border-b-0 border-[#222222] flex flex-col justify-between">
        <div className="w-full h-[40px] flex justify-start">
          <div className=" relative top-[-15px] right-[15px]">
            <Plus />
          </div>
        </div>
        <div className="w-full h-full flex justify-center items-center text-center">
          <div className="px-5 pb-0 pt-0">
            <h1 className="md:text-7xl sm:text-6xl text-5xl text-white font-[500] transition-transform duration-1000 drop-shadow-[0px_0px_120px_purple]">
              The <br className="sm:hidden block" /> Fastest <br />{" "}
              <span className="">Ai</span> Chat{" "}
              <br className="sm:hidden block" /> For Your App
            </h1>
            <div className="pt-2">
              <TextGenerateEffect className="font-normal text-zinc-400 text-sm" words="Find the hidden with one click" />
            </div>{" "}
            <br />
            <button className="py-2 px-10  border border-violet-300 text-violet-100 transition-all duration-700 rounded-full drop-shadow-[0px_0px_70px_purple] hover:drop-shadow-[0px_0px_60px_purple] bg-[#0c0c0c]">
              get started
            </button>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <div className=" relative top-[15px] right-[-15px]">
            <Plus />
          </div>
        </div>
      </div>
    </div>
  );
}
