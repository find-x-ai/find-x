import { Try } from "@/components/home";
const page = () => {
  return (
    <div className="py-20 flex justify-center">
      <div>
        <div className="px-10 flex flex-col gap-3">
          <h2 className="text-3xl text-white">Try it yourself...</h2>
          <span className="text-zinc-400">
            Recieve api key over email address.
          </span>
        </div>
        <Try />
      </div>
    </div>
  );
};

export default page;
