import type { Metadata } from "next";
import { SideBar } from "@/components/docs";

export const metadata: Metadata = {
  title: "Documentation",
  description: "docs for find-x-ai",
};

export default async function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex md:flex-row flex-col w-full md:h-screen overflow-hidden">
      <div className="md:h-screen w-[100vw] md:w-[300px] relative">
        <SideBar />
      </div>
      <div className="p-5 w-full h-full md:pt-5 pt-[90px] bg-[#111111] overflow-y-auto scrollbar-hide docs">
        {children}
      </div>
    </div>
  );
}
