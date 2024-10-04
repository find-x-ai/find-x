import { getSession } from "@/actions/auth";
import { Aside } from "@/components/dashboard";
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  return (
    <main className="flex">
      <Aside session={session} />
      <div className="bg-[#141414] w-full text-white">{children}</div>
    </main>
  );
}
