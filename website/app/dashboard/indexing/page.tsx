import React from "react";
import { AllIndexes } from "./_components";
import { getIndexes } from "@/actions/indexing";
import { Index } from "@/actions/types";

type IndexWithContentLength = Omit<Index, "content"> & {
  content_length: number;
};

export const revalidate = 0;
const page = async () => {
  const indexes = (await getIndexes()) as IndexWithContentLength[];
  return <AllIndexes />;
};

export default page;
