import Hero from "./Hero";
import SubHero from "./SubHero";
export default async function Home() {
  return (
    <div className="w-full mt-3">
      <Hero />
      <SubHero />
    </div>
  );
}
