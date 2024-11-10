import React from "react";
import { NoIndexes } from "./no-indexes";

export function AllIndexes({ indexes }: { indexes: [] }) {
  return <main className="w-full h-full"> {indexes.length === 0 ? <NoIndexes /> : <></>}</main>;
}
