import React from "react";

export const CloseIcon = () => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="lucide lucide-x fx-w-[40px] fx-h-[40px] fx-rounded-full fx-bg-blue-500/20 fx-p-2 fx-text-blue-500"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </>
  );
};

export const SearchIcon = ({ theme }: { theme: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`${
        theme === "light" ? "f-text-zinc-800" : "f-text-[#FF371A]"
      } f-stroke-2`}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
};

export const SparkleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="f-stroke-2 f-text-white"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
};

export const CopyIcon = ({ theme }: { theme: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={`f-stroke-2 f-w-8 f-h-8 f-p-2 ${
        theme === "light" ? "f-stroke-[#273734]" : "f-stroke-neutral-300"
      }`}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
};

export const TickMarkIcon = ({ theme }: { theme: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={`f-stroke-2 f-w-8 f-h-8 f-p-2 ${
        theme === "light" ? "f-stroke-[#273734]" : "f-stroke-neutral-300"
      }`}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

export const ShevronDownIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={` f-stroke-2 f-w-[30px] f-h-[30px] ${className}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};

export const TextIcon = ({ theme }: { theme: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={`f-stroke-2 f-w-[25px] f-h-[25px] ${
        theme === "light" ? "f-stroke-[#273734]" : "f-stroke-[#FF371A]"
      }`}
    >
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  );
};

export const SourcesIcon = ({
  theme,
  isOpen,
}: {
  theme: string;
  isOpen: boolean;
}) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fak"
      data-icon="sources"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={`f-stroke-2 f-w-8 f-h-8 f-p-2 ${
        theme === "light" ? "f-stroke-[#273734]" : "f-stroke-neutral-300"
      } f-w-[35px] f-h-[35px] ${
        isOpen && "f-transform f-rotate-[360deg]"
      } f-transition-transform f-duration-200`}
    >
      <path
        fill="currentColor"
        d="M262.4 32a76.8 76.8 0 1 1 0 153.6 76.8 76.8 0 1 1 0-153.6zm0 51.2a25.6 25.6 0 1 0 0 51.2 25.6 25.6 0 1 0 0-51.2zM416 185.6a76.8 76.8 0 1 1 0 153.6 76.8 76.8 0 1 1 0-153.6zm0 51.2a25.6 25.6 0 1 0 0 51.2 25.6 25.6 0 1 0 0-51.2zM108.8 185.6a76.8 76.8 0 1 1 0 153.6 76.8 76.8 0 1 1 0-153.6zm0 51.2a25.6 25.6 0 1 0 0 51.2 25.6 25.6 0 1 0 0-51.2zM262.4 339.2a76.8 76.8 0 1 1 0 153.6 76.8 76.8 0 1 1 0-153.6zm0 51.2a25.6 25.6 0 1 0 0 51.2 25.6 25.6 0 1 0 0-51.2z"
      ></path>
    </svg>
  );
};
