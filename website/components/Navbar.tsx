import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full flex justify-center items-center sticky top-0 z-50 px-5 bg-white">
      <nav className="w-full flex justify-between items-center max-w-[1200px] h-[60px]">
        <div>
          <Link className="text-lg text-black font-semibold" href={"/"}>
            Find X
          </Link>
        </div>
        <div className="flex items-center gap-5 text-[#222]">
            <Link className="hover:underline" href={'/'}>pricing</Link>
            <Link className="hover:underline" href={'/'}>docs</Link>
            <Link className="p-2 text-white bg-[#222] rounded-md" href={'/'}>Dashboard</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
