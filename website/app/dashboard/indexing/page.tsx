import React from "react";
import { AllIndexes } from "./_components";
import { getIndexes } from "@/actions/indexing";
import { Index } from "@/actions/types";

export const revalidate = 0;
const page = async () => {
  const indexes = (await getIndexes()) as Index[];
  return <AllIndexes indexes={indexes} />;
};

export default page;
