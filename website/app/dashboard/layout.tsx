import { getSession } from "@/actions/auth";
import { Sidebar } from "@/components/dashboard";
import { BreadcrumbComponent } from "@/app/docs/_components/bread";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard for FIND-X",
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return (
    <main className="flex h-screen bg-[#111111]">
      <Sidebar session={session} />
      <div className=" w-full h-full pt-[120px] md:pt-0 overflow-y-auto scrollbar-hide">
        <BreadcrumbComponent />
        <div className="w-full h-[calc(100vh-120px)] md:h-[calc(100vh-60px)]">
          {children}
        </div>
      </div>
    </main>
  );
}
