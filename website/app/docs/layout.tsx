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
    <div className="flex w-full md:h-screen overflow-hidden">
      <SideBar />
      <div className="p-5 w-full h-full bg-[#111111] overflow-y-auto scrollbar-hide docs">
        {children}
      </div>
    </div>
  );
}
