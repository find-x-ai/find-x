"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { name: "docs", url: "/docs", target: "_self" },
  { name: "team", url: "/team", target: "_self" },
  { name: "contact", url: "/contact", target: "_self" },
];

const LinksComponent = () => {
  const path = usePathname().split("/")[1];
  return (
    <ul className="flex gap-6 py-2 px-2 items-center">
      {links.map((link, i) => (
        <Link
          key={i}
          className={` py-2 px-5 transition-colors duration-100 rounded-full ${
            path === link.name
              ? "bg-zinc-800 text-white hover:bg-zinc-900"
              : "text-black  hover:bg-zinc-200"
          }`}
          target={link.target}
          href={link.url}
        >
          {link.name}
        </Link>
      ))}
    </ul>
  );
};

export default LinksComponent;
