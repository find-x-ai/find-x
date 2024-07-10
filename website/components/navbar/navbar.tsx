import Link from "next/link";

const links = [
  { name: "about", url: "/about", target: "self" },
  { name: "contact", url: "https://twitter.com/Find_X_AI", target: "blanc" },
  { name: "team", url: "/team", target: "self" },
  { name: "pricing", url: "/pricing", target: "self" },
];

export const Navbar = () => {
  return (
    <nav className="w-full h-[60px] z-20 bg-zinc-950 border-b border-zinc-800 text-white sticky top-0 flex justify-center items-center px-3">
      <div className="w-full max-w-[1200px] flex justify-between items-center">
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
