import Link from "next/link";

export const Sales = () => {
  return (
    <div className="w-full p-6 md:p-10 my-5 flex justify-center bg-zinc-200 border border-zinc-800 rounded-lg">
      <div className="w-full max-w-[500px] flex justify-center gap-5 items-center">
        <div className="">
          <h2 className="text-xl md:text-2xl font-semibold">Contact sales now </h2>
        </div>
        <div>
          <Link
            className="w-[120px] px-5 py-4 rounded-md bg-zinc-800 text-white"
            href={"/request"}
          >
            request
          </Link>
        </div>
      </div>
    </div>
  );
};
