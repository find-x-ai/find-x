import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

const LIMITS = {
  free: 500,
  pro: 2000,
  enterprise: 10000000,
};
export const RemainingCard = ({
  plan,
  count,
}: {
  plan: "free" | "pro" | "enterprise";
  count: number;
}) => {
  const remaining = LIMITS[plan] - count < 0 ? 0 : LIMITS[plan] - count;
  return (
    <Card className="bg-[#121212] border-[#202020] w-full">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Remaining</CardTitle>
        <CardDescription>Remaining requests</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-2xl text-white ">{remaining}</span>
      </CardContent>
    </Card>
  );
};
