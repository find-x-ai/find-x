import { IndexProvider } from "@/context/index-context";
export default function IndexingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <IndexProvider>
      <main className="flex w-full h-full flex-col">{children}</main>
    </IndexProvider>
  );
}
