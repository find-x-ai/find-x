import { PrivacyPolicy } from "./_components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const page = () => {
  return (
    <div className="flex justify-center items-center">
      <PrivacyPolicy />
    </div>
  );
};

export default page;
