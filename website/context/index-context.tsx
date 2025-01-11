"use client";
import { createContext, useContext, useState } from "react";
import { Index } from "@/actions/types";

export const IndexContext = createContext<{
  index: Index | null;
  setIndex: (index: Index | null) => void;
}>({
  index: null,
  setIndex: () => {},
});

export const IndexProvider = ({ children }: { children: React.ReactNode }) => {
  const [index, setIndex] = useState<Index | null>(null);
  return (
    <IndexContext.Provider value={{ index, setIndex }}>
      {children}
    </IndexContext.Provider>
  );
};

export const useIndex = () => {
  const context = useContext(IndexContext);
  if (!context) {
    throw new Error("useIndex must be used within an IndexProvider");
  }
  return context;
};
