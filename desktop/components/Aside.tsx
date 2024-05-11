"use client";
import Link from "next/link";
import NewApp from "./NewApp";
import { usePathname } from "next/navigation";
import { Radio } from "lucide-react";

const Aside = () => {
  const path = usePathname();
  return (
    <div className="h-screen flex flex-col justify-between px-10 py-5 bg-black border-r border-zinc-900">
      <div className="flex flex-col text-start gap-3 text-[#fff]">
        <Link
          className={`hover:bg-zinc-900 transition-colors duration-300 py-2 px-3 rounded-full flex items-center gap-3 ${
            path === "/"
              ? "text-amber-500 bg-zinc-950 "
              : "text-[#fff]"
          }`}
          href={"/"}
        >
          <HomeIcon />
          Home
        </Link>
        <Link
          className={`hover:bg-zinc-900 transition-colors duration-300 py-2 px-3 rounded-full flex items-center gap-3 ${
            path === "/requests"
              ? "text-amber-500 bg-zinc-950"
              : "text-[#fff]"
          }`}
          href={"/"}
        >
          <Radio />
           Requests
        </Link>
        <Link
          className={`hover:bg-zinc-900 transition-colors duration-300 py-2 px-3 rounded-full flex items-center gap-3 ${
            path === "/all"
              ? "text-amber-500 bg-zinc-950"
              : "text-[#fff]"
          }`}
          href={"/all"}
        >
          <AllClients />
          clients
        </Link>
      </div>
      <div>
        <NewApp />
      </div>
    </div>
  );
};

export default Aside;

const HomeIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="r-4qtqp9 w-[22px] fill-white/90 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-lwhw9o r-cnnz9e"
    >
      <g>
        <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
      </g>
    </svg>
  );
};

const AllClients = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="r-4qtqp9 w-[22px] fill-white/90 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-lwhw9o r-cnnz9e"
    >
      <g>
        <path d="M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z"></path>
      </g>
    </svg>
  );
};
