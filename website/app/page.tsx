import { Hero, Video, Features, WeMakeDifference } from "@/components/home";
export default async function Home() {
  const res = await fetch("https://registry.npmjs.org/find-x-ai", {
    next: { revalidate: 100 },
  });
  const package_info = await res.json();
  const version = package_info["dist-tags"].latest;
  return (
    <div className="px-5 flex flex-col gap-5 pb-10">
      <Hero version={version} />
      <Video />
      <Features />
      <WeMakeDifference />
    </div>
  );
}
