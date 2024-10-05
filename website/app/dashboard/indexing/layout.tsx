export default async function IndexingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className=" flex justify-between items-center px-5 border-b h-[70px] border-[#353535]">
        <h2 className="text-3xl ">
          Indexing <span className="gradient-text">Apps</span>
        </h2>
      </div>
      <div className="w-full h-full">{children}</div>
    </main>
  );
}
