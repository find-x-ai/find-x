import GettingStarted from "@/components/docs/getting_started.mdx"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Getting Started",
};

const page = () => {
  return (
    <GettingStarted/>
  )
}

export default page