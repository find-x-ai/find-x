import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  FormEvent,
} from "react";
import { ArrowIcon } from "../icons/svgs";

export const Suggestions = ({
  suggestions,
  theme,
  searchQuery,
  setSearchQuery,
}: {
  suggestions: string[];
  theme: "light" | "dark";
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
}) => {
  // Memoize filtered suggestions so their reference is stable.
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((suggestion) =>
      searchQuery.length > 0
        ? suggestion.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );
  }, [suggestions, searchQuery]);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Reset the selected index when the search query changes.
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Create a stable keydown handler that always uses the latest state.
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (filteredSuggestions.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
        );
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          await new Promise((res) => setTimeout(res, 0));
          setSearchQuery(filteredSuggestions[selectedIndex]);
          //   handleSubmit(e as any);
          e.stopImmediatePropagation();
        }
      }
    },
    [filteredSuggestions, selectedIndex, setSearchQuery]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <div
      className={`f-mt-2 f-w-full f-rounded-lg ${
        theme === "light" ? "f-bg-zinc-100" : "f-bg-[#191a1a]"
      } f-p-5`}
    >
      {filteredSuggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => setSearchQuery(suggestion)}
          className={`f-mb-2 f-p-2 f-border ${
            selectedIndex === index
              ? theme === "light"
                ? "f-border-zinc-300 f-bg-zinc-200"
                : "f-border-zinc-700 f-bg-[#2a2b2b]"
              : "f-border-transparent"
          } ${
            theme === "light"
              ? "hover:f-border-zinc-200 hover:f-bg-zinc-100"
              : "hover:f-border-zinc-800 hover:f-bg-[#212323]"
          } f-rounded-lg f-cursor-pointer f-flex f-items-center f-justify-between f-group`}
        >
          <span>{suggestion}</span>
          <span className={`group-hover:f-block ${selectedIndex === index ? "f-block" : "f-hidden"}`}>
            <ArrowIcon theme={theme} />
          </span>
        </div>
      ))}
    </div>
  );
};
