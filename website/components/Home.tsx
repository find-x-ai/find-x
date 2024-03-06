import Hero from "./Hero";
import SubHero from "./SubHero";
import Features from "./Features";
export default async function Home() {
  return (
    <div className="w-full">
      <Hero />
      <SubHero />
      <Features />
    </div>
  );
}
