import React from "react";

const hero = () => {
  return (
    <div className="w-full flex flex-col gap-10 items-center justify-center text-center py-10 px-5">
      <div className=" px-5 py-2 rounded-full backdrop-blur-lg border border-[#16193d] shadow-xl text-[#B3BCD0]">
        free <span className="text-white">10$</span> credits for new users
      </div>
      <h1 className="text-4xl sm:text-7xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-600">
      The ultimate AI <br /> assistant for the web
      </h1>
      <p className="max-w-[600px] sm:text-xl text-lg text-[#B3BCD0]">
       lightning-fast,
        budget-friendly, and effortlessly integrated.
      </p>
      <div>
        <button className="py-2 px-5 bg-[#5D69D3] rounded-full">
          get started for free
        </button>
      </div>
    </div>
  );
};

export default hero;
