import Link from "next/link";

const Navbar = () => {
  return (
    <div className="w-full flex justify-center items-center sticky top-0 z-50 px-5 bg-white shadow-[0px_10px_30px_white]">
      <nav className="w-full flex justify-between items-center max-w-[1200px] h-[60px]">
        <div className="shadow-[10px_0px_20px_white] z-20 w-[80px]">
          <Link className="text-lg text-black font-semibold" href={"/"}>
            Find X
          </Link>
        </div>
        <div className="flex flex-shrink px-2 justify-end items-center gap-5 text-[#222] min-w-[100px] sm:overflow-hidden overflow-x-scroll">
            <Link className="hover:underline" href={'/'}>pricing</Link>
            <Link className="hover:underline" href={'/'}>docs</Link>
            {/* <Link className="hover:underline" href={'/'}>team</Link> */}
            <Link className="p-2 text-white bg-[#222] rounded-md" href={'/'}>Dashboard</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
