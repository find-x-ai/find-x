"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Getting Started",
    url: "/docs/getting_started",
  },
  {
    name: "Installation",
    url: "/docs/installation",
  },
  {
    name: "Setup Instructions",
    url: "/docs/setup",
  },
  {
    name: "Custom Component",
    url: "/docs/custom",
  },
];

export const SideBar = () => {
  const path = usePathname();

  return (
    <aside className="w-full h-full border-x max-w-[300px] flex-col gap-3 p-6 hidden md:flex">
      {links.map((link, i) => (
        <Link
          key={i}
          href={link.url}
          className={`block py-3 px-4 rounded-lg text-lg font-medium transition-colors duration-300 ${
            path.includes(link.url)
              ? "bg-zinc-200 text-zinc-900"
              : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </aside>
  );
};
