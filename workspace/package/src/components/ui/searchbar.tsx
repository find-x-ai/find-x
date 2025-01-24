import React, { FormEvent } from "react";
import { SearchIcon } from "../icons/svgs";
import { useState } from "react";

interface SearchBarProps {
  handleSubmit: (e: FormEvent, search: string) => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
  theme: "light" | "dark";
}

export const SearchBar: React.FC<SearchBarProps> = ({
  handleSubmit,
  setIsOpen,
  theme,
}) => {
  const [search, setSearch] = useState<string>("");

  return (
    <div
      className={`f-flex f-w-full f-h-14 ${
        theme === "light" ? "f-bg-zinc-100" : "f-bg-[#191a1a]"
      } f-rounded-md f-overflow-hidden f-z-10`}
    >
      <div className="f-flex f-justify-center f-items-center f-py-2 f-px-3">
        <SearchIcon theme={theme} />
      </div>
      {/*@ts-ignore*/}
      <form
        className="f-w-full f-h-full"
        onSubmit={(e) => handleSubmit(e, search)}
      >
        <input
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={true}
          autoComplete="off"
          placeholder="Search anything"
          className={`f-w-full f-h-full f-transition-all f-duration-300 f-outline-none f-bg-transparent fh-full f-p-3 ${
            theme === "light"
              ? " f-text-zinc-800 placeholder:f-text-[#273734]/80 f-caret-black"
              : "f-text-neutral-100 placeholder:f-text-neutral-300 f-caret-white"
          }`}
          type="text"
          name="search"
        />
      </form>
      <div className="f-flex f-justify-center f-items-center f-px-2">
        <div
          onClick={() => setIsOpen(false)}
          className={`f-rounded-md ${
            theme === "light"
              ? "f-bg-zinc-800 hover:f-bg-zinc-900 f-text-white"
              : "f-bg-zinc-800 hover:f-bg-zinc-800/90 f-text-white/80"
          } f-transition-colors f-duration-200 f-cursor-pointer esc f-border f-border-[#303030]`}
        >
          Esc
        </div>
      </div>
    </div>
  );
};
