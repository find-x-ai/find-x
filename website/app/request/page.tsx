import { RequestForm } from "@/components/request";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Access",
  description: "Fill up the form to use find-x",
};

const page = () => {
  return (
    <div className="w-full h-full flex justify-center sm:pt-10">
      <RequestForm />
    </div>
  );
};

export default page;
