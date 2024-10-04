import { getSession } from "@/actions/auth";
import { Sidebar } from "@/components/dashboard";
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return (
    <main className="flex">
      <Sidebar session={session} />
      <div className="bg-[#141414] w-full text-white">{children}</div>
    </main>
  );
}
