import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full flex justify-center items-center sticky top-0 z-20 px-5 shadow-[0px_10px_30px_#222] bg-[#222]">
      <nav className="w-full flex justify-between items-center max-w-[1200px] h-[60px]">
        <div>
          <Link className="text-lg text-white font-semibold" href={"/"}>
            Find X
          </Link>
        </div>
        <div className="flex items-center gap-5 text-[#fff]">
            <Link className="hover:underline" href={'/'}>pricing</Link>
            <Link className="hover:underline" href={'/'}>docs</Link>
            <Link className="p-2 text-black bg-[#fff] rounded-md" href={'/'}>Dashboard</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
