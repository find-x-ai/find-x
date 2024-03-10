import { TextGenerateEffect } from "./ui/text-generate";
import Plus from "./Plus";
import Link from "next/link";
export default async function Hero() {
  return (
    <div className="w-full h-full px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-[1200px] h-screen sm:max-h-[450px] max-h-[500px] border border-y-0 border-[#222]/20 flex flex-col justify-between">
        <div className="w-full h-full flex justify-center items-center text-center">
          <div className="px-5 pb-0 pt-0">
            <h1 className="md:text-7xl sm:text-6xl text-5xl text-[#0c0c0c] font-[700]">
              The <br className="sm:hidden block" /> <span>Fastest</span><br />{" "}
              <span className="">Ai</span> Chat{" "}
              <br className="sm:hidden block" /> For Your App
            </h1>
            <div className="pt-2">
              <TextGenerateEffect className="font-normal text-sm" words="Find the hidden with one click" />
            </div>{" "}
            <br />
            <Link href={"/configure"} className="py-2 px-10 shadow-md hover:shadow-xl hover:shadow-black transition-all duration-500 hover:scale-95 shadow-black text-white  rounded-full bg-[#0c0c0c]">
              get started
            </Link>
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
