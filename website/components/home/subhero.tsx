import React from "react";

const subhero = () => {
  return (
    <div className="w-full flex flex-col gap-10 items-center py-5">
      <h2 className="text-4xl text-[#B3BCD0] text-center">
        We make difference
      </h2>
      <div className="w-full flex sm:flex-row flex-col sm:items-start items-center gap-5 justify-center px-5">
        <div className="w-full max-w-[400px] border border-[#11132C] p-5 flex flex-col gap-3">
          <div>
            <h2 className="text-3xl">Faster Response</h2>
          </div>
          <div>
            <p className="text-[#B3BCD0]">
              Find x is average query response time is <span className="text-white">2x to 3x</span> faster than
              available AI assistants. This makes the user experience much
              better for your website users.
            </p>
          </div>
        </div>
        <div className="w-full max-w-[400px] border border-[#11132C] p-5 flex flex-col gap-3">
          <div>
            <h2 className="text-3xl">Affordable pricing</h2>
          </div>
          <div>
            <p className="text-[#B3BCD0]">
              We offer lowest price for the assistant service. Findx costs
              arround <span className="text-white">0.02$</span> for each query which is about 10X low compared to
              the available providers.
            </p>
          </div>
        </div>
        <div className="w-full max-w-[400px] border border-[#11132C] p-5 flex flex-col gap-3">
          <div>
            <h2 className="text-3xl">Free Credits</h2>
          </div>
          <div>
            <p className="text-[#B3BCD0]">
              With findx , small websites with low traffic would get <span className="text-white">10$</span> monthly
              credit for the assistant service. You don't need to pay until you
              actually have a significant amount of traffic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default subhero;
