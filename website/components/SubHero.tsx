import Plus from "./Plus";
export default async function SubHero() {
  return (
    <div className="w-full md:h-[200px] h-[600px] p-6 pt-0 pb-0 flex justify-center">
      <div className="w-full max-w-[1200px] h-full flex flex-col justify-between">
        <div className="w-full h-full flex md:flex-row flex-col text-center">
          <div className="w-full h-full border border-[#222222] ">
            <div className="cursor-crosshair w-full h-full flex flex-col justify-center items-center rounded-md group">
              <p className="text-5xl text-[#ffffff] group-hover:drop-shadow-[0_0_35px_#2563eb] group-hover:text-blue-600 group-hover:scale-95 transition-all duration-400">
                2 sec
              </p>
              <br />
              <p className="text-zinc-400 group-hover:text-blue-600 group-hover:scale-95 transition-all duration-400">
                average time for query response
              </p>
            </div>
          </div>
          <div className="w-full h-full border md:border-l-0 md:border-t border-t-0 border-[#222222]">
            <div className="cursor-crosshair w-full h-full flex flex-col justify-center items-center rounded-md group">
              <p className="text-5xl text-[#ffffff] group-hover:drop-shadow-[0_0_35px_#16a34a] group-hover:text-green-600 group-hover:scale-95 transition-all duration-400">
                0.02$
              </p>
              <br />
              <p className="text-zinc-400 group-hover:text-green-600 group-hover:scale-95 transition-all duration-400">
                charge per query
              </p>
            </div>
          </div>
          <div className="w-full h-full border md:border-l-0 md:border-t border-t-0 border-[#222222]">
            <div className="cursor-crosshair w-full h-full flex flex-col justify-center items-center rounded-md group">
              <p className="text-5xl text-[#ffffff] group-hover:drop-shadow-[0_0_35px_#d97706] group-hover:text-amber-600 group-hover:scale-95 transition-all duration-400">
                0 wait
              </p>
              <br />
              <p className="text-zinc-400 group-hover:text-amber-600 group-hover:scale-95 transition-all duration-400">
                start by just a click
              </p>
            </div>
          </div>
        </div>
        {/* <div className="p-5 border border-t-0 border-[#222222]">
          <h1 className="text-4xl text-white text-center">
            Instant activation
          </h1>
          <br />
          <p className="text-center text-zinc-400">
            Sign up and instantly configure your app in just few clicks. On your
            first trial get 300 queries of free credit to get started.
          </p>
        </div> */}
        <div className="w-full flex justify-start relative top-[-15px] right-[15px]">
          <Plus />
        </div>
      </div>
    </div>
  );
}
