"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteClient } from "../actions/client";
import { toast } from "sonner";
import Back from "@/components/ui/Back";
const Page = () => {
  const searchParams = useSearchParams();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setLoading(false);
  }, []);

  const search = searchParams.get("id") as string;
  if (!search) {
    return <div></div>;
  }
  const data = search?.split("*");

  const client = {
    id: data[0],
    joined_at: data[1],
    url: data[2],
    name: data[3],
    plan: data[4],
    key: data[5],
    email: data[6],
  };

  const handleDeleteClient = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteClient = () => {
    // Perform delete operation here
    console.log("Client deleted:", client.name);
    toast.promise(deleteClient({ id: Number(client.id), key: client.key }), {
      loading: "deleting client...",
      success: () => {
        return `${client.name} deleted successfully`;
      },
      finally: () => {
        
        window.history.pushState({ page: "home" }, "", "/deleted");
        router.push("/all");
      },
    });

    setShowDeleteConfirmation(false);

    // setTimeout(() => {

    // }, 1800);
  };

  const cancelDeleteClient = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="h-full flex flex-col">
      <Back />
      {loading ? (
        <div className="text-center mt-8">Loading...</div>
      ) : (
        <div className=" overflow-hidden h-full flex flex-col justify-between">
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 border-y border-zinc-800 to-black px-6 py-4">
            <h2 className="text-2xl font-semibold text-white">{client.name}</h2>
          </div>
          <div className="px-6 py-4">
            <div className="mb-4">
              <div className="font-semibold text-zinc-500">Website URL:</div>
              <div className="text-zinc-50 py-1">{client.url}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-zinc-500">Joined At:</div>
              <div className="text-zinc-50 py-1">{client.joined_at}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-zinc-500">Plan:</div>
              <div className="text-zinc-50 py-1">{client.plan}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-zinc-500">Email:</div>
              <div className="text-zinc-50 py-1">{client.email}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-zinc-500">Key:</div>
              <div className="text-zinc-50 py-1">{client.key}</div>
            </div>
          </div>
          <div className="px-6 py-5 bg-black border-t border-zinc-800 flex justify-end">
            <button
              onClick={handleDeleteClient}
              className="text-red-500 hover:text-red-700 transition-colors duration-300 font-semibold flex items-center"
            >
              <Trash2 className="mr-2" /> Delete Client
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="bg-black text-white border border-zinc-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Delete Client: {client.name}
            </h3>
            <p className="text-zinc-600 mb-6">
              Are you sure you want to delete this client? This action cannot be
              undone.
            </p>
            <div className="flex justify-end">
              <button
                onClick={cancelDeleteClient}
                className="px-4 py-2 mr-2 text-zinc-200 border border-zinc-800 hover:text-white hover:bg-zinc-900 transition-colors duration-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteClient}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-700 transition-colors duration-300 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
