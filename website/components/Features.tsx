import Plus from "./Plus";

export default function Features() {
  return (
    <div className="w-full py-0 px-6 flex flex-col justify-center items-center relative top-[-30px]">
      <div className="w-full max-w-[1200px] h-full border border-[#222222] flex flex-col justify-between">
        <div className="px-5 pt-10 pb-5">
          <h1 className="text-5xl text-white">Your Journey, Your Data</h1>
          <br />
          <p className="text-zinc-400 leading-8 w-full max-w-[800px]">
            Your app's setup will seamlessly integrate with the data from your
            website. Every aspect visible to regular users on your site will
            serve as valuable input for your app. Think of it as harnessing the
            power of GPT for your app's benefit. <br /> Forget about manually
            inputting custom data to locate specific elements. Our automated and
            user-friendly data feeding process takes care of everything. Simply
            provide your site's URL, and you're all set!
          </p>{" "}
          <br />
          <div className="flex gap-5">
            <button className="p-2 border border-[#222222] text-white w-[120px] hover:bg-white hover:text-black transition-colors duration-500">
              start now
            </button>
            <button className="p-2 border border-[#222222] text-white w-[120px] bg-blue-600 hover:bg-blue-700  transition-colors duration-500">
              read docs
            </button>
          </div>
        </div>
        <div className="w-full flex justify-end relative top-[15px] right-[-15px]">
          <Plus />
        </div>
      </div>
      <div className="w-full max-w-[1200px] h-full border border-[#222222] flex flex-col justify-between">
        <div className="px-5 pt-10 pb-0">
          <h1 className="text-5xl text-white">Secure data flow</h1>
          <br />
          <p className="text-zinc-400 leading-8 w-full max-w-[800px]">
            Our process does not involve collecting any confidential data. We
            exclusively handle data that is observable or visible to regular
            visitors of your app. This approach mitigates security
            vulnerabilities and alleviates concerns regarding your application's
            data security.
          </p>{" "}
          <br />
        </div>
        <div className="w-full flex justify-start relative top-[15px] right-[15px]">
          <Plus />
        </div>
      </div>
    </div>
  );
}
