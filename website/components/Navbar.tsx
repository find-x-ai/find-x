import Link from "next/link";
import Ham from "./Ham";
export default function Navbar() {
  return (
    <nav className="w-full h-[60px] flex justify-center items-center sticky top-0 z-50">
      <div className="w-full h-full max-w-[1230px] backdrop-blur-sm bg-[#0c0c0c]/90 flex justify-between items-center">
        <div className="px-5">
          <Link className="text-white text-2xl" href={"/"}>
            Find x
          </Link>
        </div>
        <div className="gap-5 px-5 sm:flex hidden items-center">
          <Link className="text-white hover:underline" href={"/"}>
            team
          </Link>
          <Link className="text-white hover:underline" href={"/"}>
            docs
          </Link>
          <Link className="text-white hover:underline" href={"/"}>
            pricing
          </Link>
          <Link
            className="text-black p-2 w-[120px] bg-white text-center"
            href={"/dashboard"}
          >
            dashboard
          </Link>
        </div>
        <div className="sm:hidden block px-5">
            <Ham/>
        </div>
      </div>
    </nav>
  );
}
