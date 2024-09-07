import { Cards, Sales } from "@/components/pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing models for find-x",
};

const page = () => {
  return (
    <div className="w-full min-h-[calc(100vh-70px)] px-5">
      <div>
        <h1 className="text-3xl text-[#20A0B5] py-10 font-semibold">
          Worry about your app, not bills!
        </h1>
      </div>
      <Cards />
      <Sales />
    </div>
  );
};

export default page;
