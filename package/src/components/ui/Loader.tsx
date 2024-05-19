import React from "react";

const Loader = () => {
  return (
    <div className="fx-flex fx-gap-2 fx-p-2 fx-rounded-md fx-border fx-border-zinc-800 fx-bg-zinc-900">
      <div className="fx-flex fx-gap-2 fx-items-center">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpnghive.com%2Fcore%2Fimages%2Ffull%2Fchat-gpt-logo-png-1680405922.png&f=1&nofb=1&ipt=534dbe3f0188a158b909ee727fdc0f72716a1ded58f464a6e2c977c89901fe29&ipo=images"
          className="fx-w-[30px] fx-animate-spin fx-transition-all fx-duration-1000 fx-h-[30px] fx-rounded-full"
          alt=""
        />
        <span className="fx-text-lg fx-animate-pulse">
          <span className="fx-relative fx-flex h-3 w-3">
            <span className="fx-animate-ping fx-absolute fx-inline-flex fx-h-full fx-w-full fx-rounded-full fx-bg-blue-500 fx-opacity-75"></span>
            <span className="fx-relative fx-inline-flex fx-rounded-full fx-h-3 fx-w-3 fx-bg-blue-300"></span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default Loader;