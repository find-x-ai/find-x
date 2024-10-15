export default async function IndexingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-[calc(100vh-60px)] flex-col">
      <div className="w-full h-full">{children}</div>
    </main>
  );
}
