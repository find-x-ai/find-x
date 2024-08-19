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
    <div className="flex w-full md:h-[calc(100vh-60px)] docs">
      <SideBar />
      <div className="p-5 w-full h-full overflow-y-auto ">{children}</div>
    </div>
  );
}
