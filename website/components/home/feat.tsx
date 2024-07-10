const features = [
  {
    name: "Effiecient search",
    bullets: [
      "Uses top-tier vector search technology",
      "Handles complex website data",
      "Matches queries with relevant info",
    ],
  },
  {
    name: "Speedy response",
    bullets: [
      "Lightning-fast data retrieval",
      "Optimized for minimal latency",
      "Provides a seamless search experience",
    ],
  },
  {
    name: "Quick integration",
    bullets: [
      "Ready-to-go package and architecture",
      "Easy and quick app integration",
      "Minimal setup time",
    ],
  },
];
export const Features = () => {
  return (
    <div className="w-full text-zinc-200 space-y-16 pb-20">
      <div className="text-center">
        <h2 className="text-4xl">How it differs ?</h2>
      </div>
      <div className="flex sm:flex-row flex-col gap-5 text- leading-8">
        {features.map((feat, i) => {
          return (
            <div
              key={i}
              className="flex flex-col gap-5 w-full p-5 bg-blue-700 rounded-lg"
            >
              <div>
                <h3 className="text-3xl">{feat.name}</h3>
              </div>
              <div>
                <ul className="list-inside list-disc">
                  {feat.bullets.map((bullet, i) => {
                    return <li key={i}>{bullet}</li>;
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
