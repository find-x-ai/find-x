import { ChevronsUp, Route, TextSearch } from "lucide-react";
export const Features = () => {
  return (
    <div className="w-full flex flex-col gap-10 items-center text-center py-10">
      <div className=" space-y-3">
        <h3 className="text-xl">Introduction</h3>
        <h2 className="text-[#20A0B5] text-4xl md:text-5xl">What is it?</h2>
      </div>
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex flex-col md:flex-row gap-3">
          <div className="w-full bg-[#F6F7F9] rounded-lg md:rounded-[20px_0px_0px_0px] p-12 flex items-center justify-center text-center">
            <div className="space-y-2">
              <h3 className="font-[600] text-lg">Advanced Search</h3>
              <p className="text-zinc-600">
                AI based local search engine for websites
              </p>
            </div>
          </div>
          <div className="w-full bg-[#F6F7F9] rounded-lg md:rounded-[0px_20px_0px_0px] p-12 flex items-center justify-center text-center">
            <div className="space-y-2">
              <h3 className="font-[600] text-lg">Not Just Text</h3>
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
