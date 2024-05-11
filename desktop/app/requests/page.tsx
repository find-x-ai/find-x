"use client";
import AllRequests from "@/components/AllRequests";
import { getAllRequests } from "../actions/requests";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

type Project = {
  id: number;
  joined_at: string;
  url: string;
  name: string;
  plan: string;
  email: string;
  status: string;
};

const RequestsPage = () => {
  const [requests, setRequests] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedRequests = await getAllRequests();
      setRequests(fetchedRequests as Project[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="h-full">
      {loading ? (
        <div className="w-full h-full overflow-y-scroll flex justify-center items-center text-zinc-600 text-2xl">
          <Loader2 className="animate-spin duration-500 w-[40px] h-[40px] text-white"/>
        </div>
      ) : (
        <AllRequests requests={requests} />
      )}
    </div>
  );
};

export default RequestsPage;
