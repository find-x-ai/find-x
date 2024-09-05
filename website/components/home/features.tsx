import { ChevronsUp, Play, Route, Search, TextSearch } from "lucide-react";
export const Features = () => {
  return (
    <div className="w-full flex flex-col gap-10 items-center text-center py-10">
      <div className=" space-y-3">
        <h3 className="text-xl">Introduction</h3>
        <h2 className="text-[#20A0B5] text-4xl md:text-5xl">What is it?</h2>
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="w-full bg-[#F6F7F9] rounded-lg md:rounded-[20px_0px_0px_0px] p-5 md:p-10 flex flex-col gap-5 md:gap-7 items-center justify-center">
            <div className="flex w-full">
              <div className="w-full h-[50px] bg-[#ffffff] rounded-lg p-2 flex items-center">
                <div>
                  <Search className="text-[#20A0B5] stroke-2" />
                </div>
                <div className="w-full text-start px-5">
                  <p className="text-zinc-500">Search anything</p>
                </div>
                <div className="w-[40px] bg-zinc-200 px-2 py-1 rounded-md text-zinc-600">
                  Esc
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 justify-center items-start text-start p-2">
              <h3 className="font-[600] text-lg text-zinc-800">
                Advanced Search
              </h3>
              <p className="text-zinc-600">
                AI based local search engine for websites that finds exactly
                what users want.
              </p>
            </div>
          </div>
          <div className="w-full overflow-hidden bg-[#F6F7F9] rounded-lg md:rounded-[0px_20px_0px_0px] p-5 md:p-10 flex flex-col gap-5 md:gap-7 items-center justify-center">
            <div className="w-full h-[150px] flex gap-5">
              <div className="w-full h-full flex overflow-hidden gap-3">
                {/* Left Column */}
                <div className="w-[50%] h-full">
                  <img
                    className="w-full h-full object-cover rounded-md"
                    src="/demo_image3.jpg"
                    alt=""
                  />
                </div>

                {/* Middle Column */}
                <div className="flex flex-col w-[30%] h-full gap-3">
                  <div className="w-full h-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover rounded-md"
                      src="/demo_image1.jpg"
                      alt=""
                    />
                  </div>
                  <div className="w-full h-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover rounded-md"
                      src="/demo_image4.jpg"
                      alt=""
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="w-[20%] h-full relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover rounded-md"
                    src="/demo_image2.jpg"
                    alt=""
                  />
                  <div className="absolute flex justify-center items-center top-0 w-full h-full bg-black/80 rounded-md">
                    <Play className="text-white fill-white w-[30px] h-[30px]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 justify-center items-start text-start p-2">
              <h3 className="font-[600] text-lg text-zinc-800">
                Not Just Text
              </h3>
              <p className="text-zinc-600">
                Explore media content with Find-X not just boring text
                responses.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full text-center p-10 cursor-default bg-[#F6F7F9] rounded-lg md:rounded-[0px_0px_0px_20px] flex gap-5 justify-center items-center">
            <h2 className="text-lg tracking-wider font-medium">
              Faster response time
            </h2>{" "}
            <ChevronsUp className="w-[30px] h-[30px] text-zinc-500" />
          </div>
          <div className="w-full text-center p-10 cursor-default bg-[#F6F7F9] rounded-lg md:rounded-none flex gap-5 justify-center items-center">
            <h2 className="text-lg tracking-wider font-medium">
              Efficient search
            </h2>{" "}
            <TextSearch className="w-[30px] h-[30px] text-zinc-500" />
          </div>
          <div className="w-full text-center p-10 cursor-default bg-[#F6F7F9] rounded-lg md:rounded-[0px_0px_20px_0px] flex gap-5 justify-center items-center">
            <h2 className="text-lg tracking-wider font-medium">
              Easy integration
            </h2>{" "}
            <Route className="w-[30px] h-[30px] text-zinc-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
