"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
import { sendMagicLink } from "@/actions/auth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session?.user) {
        router.push("/register/?state=success");
      }
    };
    checkSession();
  }, []);

  const handleMagicLinkRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);

    if (!email || !validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      setEmailLoading(false);
      return;
    }

    if (!name || name.length < 3 || name.length > 15 || containsHTML(name)) {
      toast.error(
        "Name must be between 3 and 15 characters and cannot contain HTML."
      );
      setEmailLoading(false);
      return;
    }

    const res = await sendMagicLink({
      email,
      name,
      baseUrl: `${window.location.protocol}//${window.location.host}`,
    });

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setEmailLoading(false);
  };

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // HTML injection validation function
  const containsHTML = (str: string) => {
    const htmlRegex = /<[^>]*>/;
    return htmlRegex.test(str);
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google");
    } catch (error) {
      toast.error("Error registering with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] px-5">
      <Card className="w-full max-w-[400px] text-gray-100 border-[#353535] bg-[#111111]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">
            Register for <span className="gradient-text">FIND-X</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Choose your preferred registration method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleMagicLinkRegister}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#141414] border-[#353535] placeholder-gray-500 text-white"
              />
            </div>
            <div className="space-y-2 mt-4">
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
              Register with Magic Link{" "}
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
                style={{ backgroundColor: "#111111" }}
              >
                Or
              </span>
            </div>
          </div>
          <Button
            disabled={emailLoading || googleLoading}
            variant="outline"
            className="w-full bg-[#252525] hover:bg-[#202020] text-white hover:text-white border-[#353535] flex gap-3"
            onClick={handleGoogleRegister}
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-500 hover:text-emerald-400"
            >
              login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
