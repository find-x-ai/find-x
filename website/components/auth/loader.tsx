"use client";
import { Loader2 } from "lucide-react";
import { verifyMagicLink } from "@/actions/auth";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Loader({ token }: { token: string }) {
  const router = useRouter();
  useEffect(() => {
    const handle_token = async () => {
      const res = await verifyMagicLink({ token });
      if (res.success) {
        router.push("/dashboard"); 
      } else {
        router.push("/login");
      }
    };
    handle_token();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] px-5">
      <Card className="w-full max-w-md bg-[#090909] border-[#353535]">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-12 w-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-emerald-400 text-lg font-medium text-center">
            Verifying your link...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
