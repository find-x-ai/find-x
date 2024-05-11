"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
type Project = {
  id: number;
  joined_at: string;
  url: string;
  name: string;
  plan: string;
  key: string;
  email: string;
};


const Clients = ({ clients }: { clients: Project[] }) => {
  const router = useRouter();
  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {clients.length > 0 ? (
        <table className="w-full max-w-[800px] overflow-hidden divide-y divide-gray-900">
          <thead className="border-b border-zinc-900 bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:hidden md:table-cell">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-900 text-white">
            {clients.map((c, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900"}
              >
                <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                <td className="px-6 py-4 whitespace-nowrap sm:hidden md:table-cell">
                  {c.url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600">
                  {c.plan}$
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/client?id=${c.id}*${c.joined_at}*${c.url}*${c.name}*${c.plan}*${c.key}*${c.email}`}
                  >
                    <Button
                      className="text-white hover:text-white bg-black hover:bg-black border-zinc-700"
                      variant={"outline"}
                    >
                      view
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-2xl text-center text-zinc-600">No clients</h1>{" "}
        </div>
      )}
    </div>
  );
};

export default Clients;
