"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Menu from "./menu";

const links = [
  { name: "docs", url: "/docs", target: "_self" },
  { name: "team", url: "/team", target: "_self" },
  { name: "blogs", url: "/blogs", target: "_self" },
  { name: "contact", url: "/contact", target: "_self" },
];

export const Navbar = () => {
  const path = usePathname().split("/")[1];
  return (
    <nav className="w-full z-50 h-[70px] flex justify-center border-b border-zinc-200 sticky top-0">
      <div className=" w-full max-w-[1200px] px-5 flex justify-between items-center bg-zinc-100">
        <div>
          <Link
            href={"/"}
            className="text-lg tracking-[4px] font-medium text-zinc-800"
          >
            Find-X
          </Link>
        </div>
        <div className="md:block hidden">
          <ul className="flex gap-3 py-2 px-2 items-center">
            {links.map((link, i) => (
              <Link
                key={i}
                className={` py-2 px-5 transition-colors duration-100 rounded-full ${
                  path === link.name
                    ? "bg-zinc-200"
                    : "text-zinc-800  hover:bg-zinc-200"
                }`}
                target={link.target}
                href={link.url}
              >
                {link.name}
              </Link>
            ))}
          </ul>
        </div>
        <div className="md:flex hidden items-center">
          <button className="text-white bg-zinc-800 p-2 w-[120px] rounded-md">
            login
          </button>
        </div>
        <div className="md:hidden">
          <Menu links={links} />
        </div>
      </div>
    </nav>
  );
};
