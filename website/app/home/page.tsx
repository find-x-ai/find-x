import {
  Hero,
  Video,
  Features,
  WeMakeDifference,
  TotalRequests,
} from "@/components/home";
import { sql } from "@/lib/db";

export const revalidate = 0;
export default async function Home() {
  let count: number = 0;
  let version: string = "0.0.85";
  try {
    const res = await fetch("https://registry.npmjs.org/find-x-ai", {
      next: { revalidate: 100 },
    });

    const package_info = await res.json();
    version = package_info["dist-tags"].latest;
    const db_res = await sql`SELECT total_requests FROM clients`;
    db_res.forEach((c) => {
      count += parseInt(c.total_requests);
    });
  } catch (error) {
    console.log(error);
  }

  return (
    <div className=" flex flex-col gap-10">
      <Hero version={version} />
      <Video />
      <Features />
      <TotalRequests count={count} />
      <WeMakeDifference />
    </div>
  );
}
