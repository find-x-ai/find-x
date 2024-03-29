import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-[calc(100vh-50px)] flex justify-center items-center">
         <SignIn afterSignInUrl={"/dashboard"} />
    </div>
  );
}