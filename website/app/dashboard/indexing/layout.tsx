export default async function IndexingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex w-full h-full flex-col">
      <div className="w-full h-full">{children}</div>
    </main>
  );
}
