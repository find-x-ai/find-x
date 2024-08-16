import { Members } from "@/components/team";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
};

const page = () => {
  return (
    <div className="w-full h-[calc(100vh-70px)]">
      <Members />
    </div>
  );
};

export default page;
