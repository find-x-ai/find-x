export const TotalRequests = async ({ count }: { count: number }) => {
  return (
    <div className="flex items-center justify-center p-6 md:p-10 rounded-xl">
      <div className="w-full max-w-[600px] flex flex-col items-center md:space-y-0 md:flex-row gap-3 md:justify-center tracking-widest">
        <h1 className="text-2xl md:text-3xl font-semibold text-zinc-700 tracking-wide">
          Served total
        </h1>
        <div className="flex flex-col md:flex-row md:gap-2 gap-3 items-center space-x-2">
          <strong className="text-3xl md:text-4xl font-bold text-[#ff371a]">
            {count}
          </strong>
          <span className="text-2xl md:text-3xl font-medium text-zinc-700">
            requests
          </span>
        </div>
      </div>
    </div>
  );
};
