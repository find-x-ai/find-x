import { getSession } from "@/actions/anjum";
import { Aside } from "@/components/dashboard";
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex">
      <Aside />
      <div className="bg-[#141414] w-full text-white">{children}</div>
    </main>
  );
}
