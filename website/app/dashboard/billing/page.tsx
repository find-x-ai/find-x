"use client";
import { useEffect, useState } from "react";

import { PlanCard } from "./_components/plan-card";
import { Crown, Loader2 } from "lucide-react";
import { RemainingCard } from "./_components/remaining-card";
import { PaidCard } from "./_components/paid-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  const [data, setData] = useState<{
    count: number;
    plan: {
      name: "free" | "pro" | "enterprise";
      user_email: string;
      paid: number;
    };
  }>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing");
      if (!res.ok) {
        throw new Error("Failed to fetch billings");
      }
      const { plan, count } = await res.json();
      setData({
        plan,
        count,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleFetch();
  }, []);
  return (
    <div className="w-full h-full p-5">
      {loading || !data ? (
        <Loader />
      ) : (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
          <div className="flex  p-5 flex-col border border-[#202020] rounded-xl justify-center mx-auto w-full items-center ">
            <div className="flex sm:flex-row flex-col w-full gap-5 items-start justify-center h-full">
              <div className="flex flex-col gap-5 w-full h-full">
                <PlanCard plan={data?.plan?.name || "free"} />
                <Link className="w-full" href={"/pricing"}>
                  <Button className="bg-emerald-600 w-full text-white hover:bg-emerald-700">
                    Upgrade plan  <Crown/>
                  </Button>
                </Link>
              </div>
              <PaidCard amount={data?.plan?.paid || 0} />
              <RemainingCard plan={data?.plan?.name || "free"} count={data?.count || 0} />
            </div>
          </div>
          <div className="w-full border bg-[#121212] border-[#202020] rounded-xl p-5 flex flex-col justify-center gap-5 items-center">
            <div>
              <h3 className="text-3xl text-white/90">Did we miss something?</h3>
            </div>
            <Link href={"mailto:team@find-x.tech"}>
              <Button className="bg-white text-black hover:bg-white/90 hover:text-black">
                Contact support
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// const Upgrade = () => {
//   return (
//     <div className="w-full bg-violet-600 text-white rounded-lg">
//       <div className="text-center flex justify-center items-center p-3 gap-5">
//         <p className="font-semibold">Increase rate limits</p>{" "}
//         <Button>Upgrade</Button>
//       </div>
//     </div>
//   );
// };

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-zinc-500 flex items-center">
        <span>Loading billing...</span>{" "}
        <Loader2 className="animate-spin w-4 h-4" />
      </div>
    </div>
  );
};

export default page;
