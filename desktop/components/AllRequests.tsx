"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import { rejectRequest } from "@/app/actions/requests";
type Project = {
  id: number;
  joined_at: string;
  url: string;
  name: string;
  plan: string;
  email: string;
  status: string;
};

const AllRequests = ({ requests }: { requests: Project[] }) => {
  const handleReject = async (id: number) => {
    toast.promise(rejectRequest(id), {
      loading: "Rejecting request...",
      success: () => {
        return "Request rejected successfully";
      },
      error: () => {
        return "Error rejecting request!";
      },
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);

    return;
  };
  return (
    <div className="h-[550px] flex flex-col overflow-y-scroll">
      {requests.filter((r) => {
        return r.status === "waiting";
      }).length > 0 ? (
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
            {requests
              .filter((r) => {
                return r.status === "waiting";
              })
              .map((c, i) => (
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
                  <td className="px-6 flex gap-5 py-4 whitespace-nowrap">
                    <Link
                      href={`/new?data=${c.name}*${c.url}*${c.plan}*${c.email}*${c.id}`}
                    >
                      <Button
                        className="text-white hover:text-white rounded-full bg-green-600/30 border-green-600 hover:bg-green-700/30"
                        variant={"outline"}
                      >
                        <Check />
                      </Button>
                    </Link>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="text-white hover:text-white rounded-full bg-red-500/30 border-red-600 hover:bg-red-600/30"
                        >
                          <X />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black text-white border-zinc-800">
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure to delete {c.name} ?
                          </DialogTitle>
                          <DialogDescription>
                            This will reject the request.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              className="bg-black border-zinc-800"
                              variant={"outline"}
                            >
                              Cancel
                            </Button>
                          </DialogClose>
                          <DialogClose>
                            <Button
                              onClick={() => {
                                handleReject(c.id);
                              }}
                              variant={"destructive"}
                            >
                              delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-2xl text-center text-zinc-600">No Requests</h1>{" "}
        </div>
      )}
    </div>
  );
};

export default AllRequests;
