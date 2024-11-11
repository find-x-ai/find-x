import { PricingComponent, Sales } from "./_components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing models for find-x",
};

const page = () => {
  return (
    <div className="w-full min-h-[calc(100vh-70px)]">
      <PricingComponent />
      {/* <Sales /> */}
    </div>
  );
};

export default page;
