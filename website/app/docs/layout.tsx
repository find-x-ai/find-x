import type { Metadata } from "next";
import { SideBar } from "@/components/docs";
import { BreadcrumbComponent } from "@/components/docs/bread";

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
      <div className=" w-full h-full pt-[120px] md:pt-0 bg-[#111111] overflow-y-auto scrollbar-hide">
        <BreadcrumbComponent />
        <div className="docs p-5">{children}</div>
      </div>
    </div>
  );
}
