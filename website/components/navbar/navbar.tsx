import Link from "next/link";

const links = [
  { name: "docs", url: "/docs", target: "_self" },
  { name: "team", url: "/team", target: "_self" },
  { name: "contact", url: "https://twitter.com/Find_X_AI", target: "_blanc" },
];

export const Navbar = () => {
  return (
    <nav className="w-full h-[70px] z-20 bg-zinc-950 border-b border-zinc-800 text-white sticky top-0 flex justify-center items-center px-3">
      <div className="w-full max-w-[1200px] sm:px-0 px-5 flex justify-between items-center">
        <div className="w-full">
          <Link href={"/"} className="text-xl">
            FindX
          </Link>
        </div>
        <div className=" w-full flex justify-end gap-5">
          {links.map((link, i) => {
            return (
              <Link
                target={link.target}
                className="hover:underline"
                key={i}
                href={link.url}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
