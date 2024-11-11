import GettingStarted from "../_components/getting_started.mdx"
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