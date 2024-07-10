export const Features = () => {
  return (
    <div className="w-full text-zinc-200 space-y-16">
      <div className="text-center">
        <h2 className="text-4xl">How it differs ?</h2>
      </div>
      <div className="flex sm:flex-row flex-col gap-5 text- leading-8">
        <div className="flex flex-col gap-5 p-3 border border-zinc-800 rounded-xl w-full">
          <div>
            <h2 className="text-3xl">Effiecient search</h2>
          </div>
          <div className="text-start text-zinc-300">
            <ul className=" list-inside list-disc">
              <li>Uses top-tier vector search technology</li>
              <li>Handles complex website data</li>
              <li>Matches queries with relevant information</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-5 p-3 border border-zinc-800 rounded-xl w-full">
          <div>
            <h2 className="text-3xl">Speedy response</h2>
          </div>
          <div className="text-start text-zinc-300">
            <ul className=" list-inside list-disc">
              <li>Lightning-fast data retrieval</li>
              <li>Optimized for minimal latency</li>
              <li>Provides a seamless search experience</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-5 p-3 border border-zinc-800 rounded-xl w-full">
          <div>
            <h2 className="text-3xl">Quick integration</h2>
          </div>
          <div className="text-start text-zinc-300">
            <ul className=" list-inside list-disc">
              <li>Ready-to-go package and architecture</li>
              <li>Easy and quick app integration</li>
              <li>Minimal setup time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
