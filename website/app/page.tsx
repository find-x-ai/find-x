import { Hero, Features, Video, Try } from "@/components/home";
export default function Home() {
  return (
    <div className="p-5 flex flex-col gap-10">
      <Hero />
      <hr className="border-zinc-800" />
      <Video />
      <hr className="border-zinc-800" />
      <Features />
      <hr className="border-zinc-800" />
      <Try />
    </div>
  );
}
