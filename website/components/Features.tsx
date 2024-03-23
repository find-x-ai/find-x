const Features = () => {
  return (
    <div className="w-full flex md:flex-row flex-col sm:gap-10 gap-5 max-w-[1200px] cursor-pointer py-5 z-10 shadow-[0px_-20px_50px_#fafafa]">
      <div className="w-full shadow-sm border p-3 rounded-md hover:border-blue-600 transition-colors duration-300">
        <h1 className="text-4xl text-zinc-800 font-sans">
          <span className="font-semibold">3X</span> Faster
        </h1>{" "}
        <br />
        <p className=" leading-7 text-zinc-600">
          Find x average time for each query response is about 2 sec which makes
          it fastest ai chat in the current market. With this speed your
          application users doesn't have to wait for 10 sec just to get answer
          of one question
        </p>
      </div>
      <div className="w-full shadow-sm border p-3 rounded-md hover:border-blue-600 transition-colors duration-300">
        <h1 className="text-4xl text-zinc-800 font-sans">
          {" "}
          <span className="font-semibold">10X</span> Affordable
        </h1>{" "}
        <br />
        <p className=" leading-7 text-zinc-600">
          Compared to the competitions of find x we offer least charges than any
          other provider. With find x each query response for client will take
          just 0.02 $. This is 10X cheaper than the cost of other providers
        </p>
      </div>
      <div className="w-full shadow-sm border p-3 rounded-md hover:border-blue-600 transition-colors duration-300">
        <h1 className="text-4xl text-zinc-800 font-sans">
          <span className="font-semibold">100X</span> Effortless
        </h1>{" "}
        <br />
        <p className=" leading-7 text-zinc-600">
          Our whole architecture is based on serverless approach. You don't need
          to add and maintain ton of code just to enable chat in your app , just
          install the package and within minutes you are ready to serve!
        </p>
      </div>
    </div>
  );
};

export default Features;
