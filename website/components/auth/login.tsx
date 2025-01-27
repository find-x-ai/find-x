"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { sendMagicLink } from "@/actions/auth";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export function Login() {
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user) {
        router.push("/login/?state=success");
      }
    };
    checkSession();
  }, []);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      setEmailLoading(false);
      return;
    }

    const res = await sendMagicLink({
      email,
      baseUrl: `${window.location.protocol}//${window.location.host}`,
    });
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setEmailLoading(false);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google");
    } catch (error) {
      toast.error("Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] px-5">
      <Card className=" w-full max-w-[400px] text-gray-100 border-[#353535] bg-[#111111] ">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">
            Login to <span className="gradient-text">FIND-X</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Choose your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleMagicLinkLogin}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                placeholder="m@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#141414] border-[#353535] placeholder-gray-500 text-white"
              />
            </div>
            <Button
              disabled={emailLoading || googleLoading}
              className="w-full flex gap-2 items-center mt-4 bg-emerald-700 hover:bg-emerald-800 transition-all duration-300"
              type="submit"
            >
              login with Magic Link{" "}
              {emailLoading && (
                <Loader2 className="animate-spin transition-all duration-500 w-[20px] h-[20px]" />
              )}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#353535]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span
                className="px-2 text-gray-400"
                style={{ backgroundColor: "#141414" }}
              >
                Or
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full bg-[#252525] hover:bg-[#202020] text-white hover:text-white border-[#353535] flex gap-3"
            onClick={handleGoogleLogin}
            disabled={googleLoading || emailLoading}
          >
            <img
              className="w-[17px] h-[17px]"
              src="/icons/google.png"
              alt="google logo"
            />
            Continue with Google
            {googleLoading && (
              <Loader2 className="animate-spin transition-all duration-500 w-[20px] h-[20px]" />
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-sm text-[#656565] text-center">
          <p>
            By registering, you agree to our{" "}
            <Link className="underline" href={"/terms"}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link className="underline" href={"/policy"}>
              Privacy Policy
            </Link>
            .
          </p>
          <p>
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-500 hover:text-emerald-400"
            >
              create here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
