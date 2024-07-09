"use client";
import { Loader2 } from "lucide-react";
const Loader = () => {
  return (
    <div className="w-full h-full overflow-y-scroll flex justify-center items-center">
      <div>
        <Loader2 className=" animate-spin duration-300 w-[40px] h-[40px] text-white" />
      </div>
    </div>
  );
};

export default Loader;
