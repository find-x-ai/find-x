"use client"
export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col gap-10 items-center  p-24">
      <h1 className="text-5xl font-sans font-bold">
        AI based chat for your app
      </h1>
      <div className="flex justify-center flex-col items-center gap-5">
        <div className="w-[400px] h-[300px] flex flex-col gap-5 bg-zinc-100">
          <p>This is response from the server...</p>
          <p>This is response from the server...</p>
        </div>
        <div className="flex gap-5 w-[400px]">
          <input className="w-full border p-1" type="text" /> <button className="p-2 border">send</button>
        </div>
      </div>
    </main>
  );
}
