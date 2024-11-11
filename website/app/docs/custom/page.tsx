import CustomDocs from "../_components/custom.mdx"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Component",
};

const page = () => {
  return (
    <div>
        <CustomDocs/>
    </div>
  )
}

export default page