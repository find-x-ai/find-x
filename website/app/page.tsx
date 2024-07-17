import { Hero, Video, Features, WeMakeDifference } from "@/components/home";
export default function Home() {
  return (
    <div className="px-5 flex flex-col gap-5">
      <Hero />
      <Video />
      <Features />
      <WeMakeDifference/>
    </div>
  );
}
