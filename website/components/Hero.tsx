import Link from "next/link";
import Plus from "./Plus";
export default async function Hero() {
  return (
    <div className="w-full h-full p-6 pb-0 flex flex-col justify-center items-center">
      <div className="w-full max-w-[1500px] h-full border border-b-0 border-[#222222] flex flex-col justify-between">
        <div className="w-full h-[40px] flex justify-between">
          <div className=" relative top-[-15px] right-[15px]">
            <Plus />
          </div>
          <div className="flex items-center gap-5">
            <Link className="text-white hover:underline" href={"/"}>
              pricing
            </Link>
            <Link className="text-white hover:underline" href={"/"}>
              docs
            </Link>
            <div className="w-[100px] h-full bg-white flex items-center justify-center">
              <Link
                href={"/"}
                className="text-2xl flex items-end justify-center"
              >
                Find X{" "}
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full h-full">
          <div className="px-5 pb-0 pt-5">
            <h1 className="text-5xl text-white">
              The <br className="sm:hidden block" /> Fastest <br /> Ai Chat For
              Your App
            </h1>
            <h2 className="text-zinc-400 pt-2">
              Find the hidden with one click
            </h2>{" "}
            <br />
            <button className="p-2 bg-blue-600 text-white rounded-sm w-[150px] hover:bg-blue-700 transition-colors duration-300">
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
