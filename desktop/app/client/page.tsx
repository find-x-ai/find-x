"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Trash2, Mail } from "lucide-react";
import { deleteClient } from "../actions/client";
import { toast } from "sonner";
import Back from "@/components/ui/Back";
import Loader from "@/components/Loader";
import { db } from "@/lib/db";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { redis } from "@/lib/redis";
import { Update } from "@/components/Update";
import CountUp from "react-countup";

interface ClientData {
  id: string;
  joined_at: Date | string;
  url: string;
  name: string;
  plan: string;
  api_key: string;
  email: string;
}

const ClientPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [showRevokeConfirmation, setShowRevokeConfirmation] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [apiData, setApiData] = useState<{
    remaining: number;
    requests: number;
  }>({ remaining: 0, requests: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchClientData = async () => {
      const search = searchParams.get("id");
      if (!search) {
        setLoading(false);
        return;
      }
      const data = search.split("*");
      const clientFromUrl = {
        id: data[0],
      };

      try {
        const response = (await db(`SELECT * FROM CLIENT WHERE id = $1`, [
          clientFromUrl.id,
        ])) as ClientData[];
        if (response && response.length > 0) {
          const dbClient = response[0];
          const joinedAt =
            dbClient.joined_at instanceof Date
              ? dbClient.joined_at.toISOString()
              : dbClient.joined_at;
          setClientData({ ...clientFromUrl, ...dbClient, joined_at: joinedAt });
        } else {
        }

        const keyData = (await redis.get(response[0].api_key)) as {
          remaining: number;
          requests: number;
        };

        setApiData(keyData);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }

      setLoading(false);
    };

    fetchClientData();
  }, [searchParams]);

  const handleDeleteClient = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteClient = () => {
    if (clientData) {
      toast.promise(
        deleteClient({ id: Number(clientData.id), key: clientData.api_key }),
        {
          loading: "Deleting client...",
          success: () => {
            return `${clientData.name} deleted successfully`;
          },
          error: "Error deleting client",
          finally: () => {
            router.push("/all");
          },
        }
      );
    }
    setShowDeleteConfirmation(false);
  };

  const cancelDeleteClient = () => {
    setShowDeleteConfirmation(false);
  };

  const handleRevokeKey = () => {
    setShowRevokeConfirmation(true);
  };

  const revokeKey = async () => {
    const oldKey = clientData?.api_key as string;

    if (!oldKey) {
      throw "Failed to revoke key!";
    }
    const newKey = uuidv4();

    try {
      await db(`UPDATE client SET api_key = $1 WHERE api_key = $2`, [
        newKey,
        oldKey,
      ]);

      const oldData = (await redis.get(oldKey)) as {};

      if (!oldData) {
        throw "Failed to revoke api key!";
      }

      await redis.del(oldKey);
      await redis.set(newKey, oldData);

      return window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmRevokeKey = () => {
    toast.promise(revokeKey, {
      loading: "Revoking API key...",
      success: "API key revoked successfully",
      error: "Error revoking API key",
    });
    setShowRevokeConfirmation(false);
  };

  const cancelRevokeKey = () => {
    setShowRevokeConfirmation(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (!clientData) {
    return (
      <div className="w-full h-full flex flex-col">
        <Back />
        <div className="text-zinc-600 w-full h-full flex justify-center items-center text-3xl">
          No client data available
        </div>
      </div>
    );
  }

  const formattedJoinedAt =
    clientData.joined_at instanceof Date
      ? clientData.joined_at.toLocaleDateString()
      : new Date(clientData.joined_at).toLocaleDateString();

  return (
    <div className="h-full flex flex-col">
      <Back />
      <div className="overflow-hidden h-full flex flex-col justify-between">
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-950 border-y border-zinc-800 to-black px-6 flex justify-between items-center py-4">
          <h2 className="text-2xl font-semibold text-white">
            {clientData.name}
          </h2>
          <Update client={{ ...clientData, plan: "0" }} />
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <div className="font-semibold text-zinc-500">Website URL:</div>
            <div className="text-zinc-50 py-1">{clientData.url}</div>
          </div>
          <div className="mb-4">
            <div className="font-semibold text-zinc-500">Joined At:</div>
            <div className="text-zinc-50 py-1">{formattedJoinedAt}</div>
          </div>
          <div className="mb-4 flex items-center gap-7">
            <div className="py-2 px-3 w-[150px] flex justify-center flex-col border-zinc-700 text-start border rounded-md">
              <div className="font-semibold text-zinc-500">Current Plan:</div>
              <div className="text-zinc-50 py-1 text-xl">{clientData.plan}</div>
            </div>
            <div className="py-2 px-3 w-[150px] flex justify-center flex-col border-zinc-700 text-start border rounded-md">
              <div className="font-semibold text-zinc-500">Remaining:</div>
              <div className="text-zinc-50 py-1 text-xl">
                <CountUp
                  className="text-green-600"
                  duration={1.5}
                  start={0.0}
                  end={apiData?.remaining}
                  decimal="."
                  decimals={2}
                />
                $
              </div>
            </div>
            <div className="py-2 px-3 w-[150px] flex justify-center flex-col border-zinc-700 text-start border rounded-md">
              <div className="font-semibold text-zinc-500">Requests:</div>
              <div className="text-zinc-50 py-1 text-xl">
                <CountUp
                  duration={1.5}
                  start={0}
                  end={apiData?.requests}
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold text-zinc-500">Email:</div>
            <div className="text-zinc-50 py-1 flex items-center gap-5">
              {clientData.email}{" "}
              <a title="Send email" href={`mailto:${clientData.email}`}>
                <Mail className="w-[25px] text-zinc-600 h-[25px]" />
              </a>
            </div>
          </div>
          <div className="">
            <div className="font-semibold text-zinc-500">Key:</div>
            <div className="text-zinc-50 py-1 flex gap-3 items-center">
              <input
                className="bg-transparent w-full focus:outline-none border p-2 rounded-md border-zinc-800"
                value={clientData.api_key}
                readOnly
              />
              <button
                onClick={handleRevokeKey}
                className="p-2 border border-red-600 transition-colors duration-300 rounded-md w-[120px] text-red-600 hover:bg-red-600 hover:text-white"
              >
                revoke
              </button>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 bg-black border-t border-zinc-800 flex justify-end">
          <button
            onClick={handleDeleteClient}
            className="text-red-600 hover:text-red-700 transition-colors duration-300 font-semibold flex items-center"
          >
            <Trash2 className="mr-2" /> Delete Client
          </button>
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="bg-black text-white border border-zinc-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Delete Client: {clientData.name}
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

      {showRevokeConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="bg-black text-white border border-zinc-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Revoke API Key for {clientData.name}
            </h3>
            <p className="text-zinc-600 mb-6">
              Are you sure you want to revoke this client's API key? This action
              cannot be undone.
            </p>
            <div className="flex justify-end">
              <button
                onClick={cancelRevokeKey}
                className="px-4 py-2 mr-2 text-zinc-200 border border-zinc-800 hover:text-white hover:bg-zinc-900 transition-colors duration-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmRevokeKey}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-700 transition-colors duration-300 rounded-md"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
