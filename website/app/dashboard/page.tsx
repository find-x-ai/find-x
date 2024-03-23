import { UserButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div className="h-screen pt-10 flex justify-center">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
