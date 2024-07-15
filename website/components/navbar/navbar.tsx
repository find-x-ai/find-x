import Link from "next/link";
import LinksComponent from "./links";

export const Navbar = () => {
  return (
    <nav className="w-full z-50 h-[70px] flex justify-center border-b border-zinc-200 sticky top-0">
      <div className=" w-full max-w-[1200px] px-5 flex justify-between items-center bg-zinc-100">
        <div>
          <Link href={"/"} className="text-lg tracking-[4px] font-medium text-zinc-800">
            Find-X
          </Link>
        </div>
        <div className="md:block hidden">
          <LinksComponent />
        </div>
        <div className="flex items-center">
          <button className="text-white bg-zinc-800 p-2 w-[120px] rounded-md">
            login
          </button>
        </div>
      </div>
    </nav>
  );
};
