import Link from "next/link";
const Navbar = () => {
  return (
    <nav className="bg-[#11132c]/50 w-full flex justify-center z-20 items-center h-[50px] backdrop-blur-md sticky top-0 border-b-2 border-[#181a34] px-5">
      <div className="w-full max-w-[1200px] flex justify-between items-center">
        <div>
          <Link className="text-lg" href={"/"}>
            Find x
          </Link>
        </div>
        <div className="sm:flex items-center hidden gap-5">
          <Link href={"/"}>pricing</Link>
          <Link href={"/"}>about</Link>
          <Link href={"/"}>team</Link>
          <Link className="py-2 px-5 bg-[#5D69D3] rounded-full" href={"/"}>
            dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
