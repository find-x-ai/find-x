import Link from "next/link";
import Ham from "./Ham";
export default function Navbar() {
  return (
    <nav className="w-full h-[60px] flex justify-center items-center sticky top-0 z-50 backdrop-blur-md bg-[#fff]/30 border-b border-[#222]/20">
      <div className="w-full h-full max-w-[1230px] flex justify-between items-center">
        <div className="px-5">
          <Link className="text-[#222] text-2xl" href={"/"}>
            Find x
          </Link>
        </div>
        <div className="gap-5 px-5 sm:flex hidden items-center">
          <Link className="text-[#222] hover:underline" href={"/"}>
            team
          </Link>
          <Link className="text-[#222] hover:underline" href={"/"}>
            docs
          </Link>
          <Link className="text-[#222] hover:underline" href={"/"}>
            pricing
          </Link>
          <Link
            className="text-white p-2 w-[120px] bg-[#222] text-center rounded-md"
            href={"/dashboard"}
          >
            dashboard
          </Link>
        </div>
        <div className="sm:hidden block px-5">
          <Ham />
        </div>
      </div>
    </nav>
  );
}
