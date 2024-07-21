import React from "react";
import { SearchIcon } from "../icons/svgs";

interface SearchBarProps {
  handleSubmit: (formData: FormData) => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  handleSubmit,
  setIsOpen,
}) => (
  <div className="f-flex f-w-full f-h-14 f-bg-[#fcfdf8] f-rounded-md f-overflow-hidden f-z-10 f-border f-border-zinc-800/90">
    <div className="f-flex f-justify-center f-items-center f-py-2 f-px-3">
      <SearchIcon />
    </div>
    {/*@ts-ignore*/}
    <form className="f-w-full f-h-full" action={handleSubmit}>
      <input
        autoFocus={true}
        autoComplete="off"
        placeholder="Search anything"
        className="f-w-full f-h-full f-transition-all f-duration-300 f-outline-none f-bg-transparent fh-full f-p-3 f-text-[#273734]  placeholder:f-text-[#273734]/80 f-caret-[#273734]"
        type="text"
        name="search"
      />
    </form>
    <div className="f-flex f-justify-center f-items-center f-px-2">
      <button
        onClick={() => setIsOpen(false)}
        className="f-py-1 f-px-2 f-border f-rounded-md f-text-[#273734]/80 f-border-[#273734]/80 hover:f-border-red-500 hover:f-text-white hover:f-bg-red-500  f-transition-colors f-duration-200 f-cursor-pointer"
      >
        Esc
      </button>
    </div>
  </div>
);
