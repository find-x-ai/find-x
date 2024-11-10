import React from "react";
import { AllIndexes } from "./components";
import { getIndexes } from "@/actions/indexing";
const page = async () => {
  const indexes = (await getIndexes()) as [];
  return <AllIndexes indexes={indexes} />;
};

export default page;
