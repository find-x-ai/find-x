import Plus from "./Plus";
export default async function SubHero() {
  return (
    <div className="w-full md:h-[350px] h-[800px] p-6 pt-0 flex justify-center">
      <div className="w-full max-w-[1500px] h-full flex flex-col justify-between">
        <div className="w-full h-full flex md:flex-row flex-col">
          <div className="w-full h-full border border-[#222222] ">
            <div className="cursor-crosshair w-full h-full flex flex-col justify-center items-center rounded-md group">
              <p className="text-6xl sm:text-white drop-shadow-[0_0_35px_#2563eb] text-blue-600 group-hover:text-blue-600 group-hover:scale-95 transition-all duration-400">2 sec</p><br />
              <p className="sm:text-zinc-400 text-blue-600 group-hover:text-blue-600 group-hover:scale-95 transition-all duration-400">average time for query response</p>
            </div>
          </div>
          <div className="w-full h-full border md:border-l-0 md:border-t border-t-0 border-[#222222]">
          <div className="cursor-crosshair w-full h-full flex flex-col justify-center items-center rounded-md group">
              <p className="text-6xl sm:text-white drop-shadow-[0_0_35px_#16a34a] text-green-600 group-hover:text-green-600 group-hover:scale-95 transition-all duration-400">0.02$</p><br />
              <p className="sm:text-zinc-400 text-green-600 group-hover:text-green-600 group-hover:scale-95 transition-all duration-400">charge per query</p>
            </div>
          </div>
          <div className="w-full h-full border md:border-l-0 md:border-t border-t-0 border-[#222222]">
          <div className="cursor-crosshair w-full h-full flex flex-col justify-center items-center rounded-md group">
              <p className="text-6xl sm:text-white drop-shadow-[0_0_35px_#d97706] text-amber-600 group-hover:text-amber-600 group-hover:scale-95 transition-all duration-400">0 wait</p><br />
              <p className="sm:text-zinc-400 text-amber-600 group-hover:text-amber-600 group-hover:scale-95 transition-all duration-400">start by just a click</p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-start relative top-[-15px] right-[15px]">
          <Plus />
        </div>
      </div>
    </div>
  );
}
