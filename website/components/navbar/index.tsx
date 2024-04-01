import Link from "next/link";


const Navbar = () => {
  return (
    <nav className="bg-[#11132c]/50 w-full flex justify-center z-20 items-center h-[50px] backdrop-blur-md sticky top-0 border-b-2 border-[#181a34]">
      <div className="w-full max-w-[1200px] flex justify-between items-center px-5">
        <div>
          <Link className="text-lg" href={"/"}>
            Find x
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <Link className="sm:block hidden" href={"/"}>
            pricing
          </Link>
          <Link className="sm:block hidden" href={"/"}>
            about
          </Link>
          <Link className="sm:block hidden" href={"/"}>
            team
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
