import { TeamComponent } from "@/components/team";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
};

const page = () => {
  return (
    <div className="min-h-[calc(100vh-100px)]">
      <TeamComponent />
    </div>
  );
};

export default page;
