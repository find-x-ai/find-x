import React from "react";

const ReferenceLinks = ({ links }: { links: string[] }) => (
  <div className="f-px-2 f-flex f-flex-wrap f-gap-2">
    {links
      .filter((link) => link.trim() !== "")
      .map((link, index) => (
        <a
          title={link}
          key={index}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="f-px-2 f-w-[25px] f-h-[25px] f-flex f-justify-center f-items-center f-text-xs f-py-1 f-bg-zinc-900 f-text-zinc-200 f-rounded-full f-border f-border-zinc-700 hover:f-bg-zinc-800 f-transition-colors"
        >
          {index + 1}
        </a>
      ))}
  </div>
);

export { ReferenceLinks };
