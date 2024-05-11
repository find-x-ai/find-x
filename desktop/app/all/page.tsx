"use client";
import { db } from "@/lib/db";
import Clients from "@/components/Clients";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

type Project = {
  id: number;
  joined_at: string;
  url: string;
  name: string;
  plan: string;
  key: string;
  email: string;
};

const ClientsPage = () => {
  const [clients, setClients] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = (await db.from("clients").select("*")) as {
        data: Project[];
      };
      setClients(data.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {loading ? (
        <div className="h-full w-full overflow-y-scroll flex flex-col justify-center items-center text-2xl text-zinc-600">
          <Loader2 className="animate-spin duration-500 w-[40px] h-[40px] text-white"/>
        </div>
      ) : (
        <Clients clients={clients} />
      )}
    </div>
  );
};

export default ClientsPage;
