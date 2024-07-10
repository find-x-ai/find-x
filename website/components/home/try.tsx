import React from "react";

export const Try = () => {
  return (
    <div className="bg-gradient-to-br rounded-lg from-zinc-900 via-zinc-950 to-black border border-zinc-800 py-8 md:py-10 flex flex-col gap-10 md:gap-20 justify-center items-center text-white p-4 md:p-5">
      <div>
        <h2 className="text-3xl md:text-4xl text-start">Try it yourself.</h2>
      </div>
      <div className="w-full max-w-[500px]">
        <form className="flex flex-col gap-5 w-full" action="">
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name">Name</label>
              <input
                required
                id="name"
                name="name"
                type="text"
                className="p-2 rounded-md bg-transparent text-white border border-zinc-800"
                placeholder="Enter your app name"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="email">Email</label>
              <input
                required
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                className="p-2 rounded-md bg-transparent text-white border border-zinc-800"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="url">URL</label>
            <input
              required
              id="url"
              name="url"
              type="text"
              className="p-2 rounded-md bg-transparent text-white border border-zinc-800"
              placeholder="https://example.com/"
            />
          </div>
          <button className="p-2 w-full rounded-md bg-blue-600 border border-zinc-800 hover:bg-blue-800 transition-colors">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
