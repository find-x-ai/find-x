import { getSession } from "@/actions/auth";
import { Sidebar } from "@/components/dashboard";
import { BreadcrumbComponent } from "@/components/docs/bread";
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return (
    <main className="flex">
      <Sidebar session={session} />
      <div className=" w-full min-h-screen pt-[120px] md:pt-0 bg-[#111111] overflow-y-auto scrollbar-hide">
        <BreadcrumbComponent />
        <div>{children}</div>
      </div>
    </main>
  );
}
