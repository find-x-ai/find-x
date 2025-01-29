import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
const PLAN_DATA = {
  free: {
    title: "Free",
    description: "free account!",
    offerings: [
      "500 free requests",
      "Basic support",
      "llama models",
      "Basic Analytics",
    ],
  },
  pro: {
    title: "Pro",
    description: "Paid account",
    offerings: [
      "2000 requests",
      "Priority support",
      "Deepseek models",
      "Advanced analytics",
    ],
  },
  enterprise: {
    title: "Enterprise",
    description: "Enterprise account",
    offerings: [
      "Unlimited requests",
      "Custom integrations",
      "All models",
      "Dedicated support",
    ],
  },
};

export const PlanCard = ({ plan }: { plan: "free" | "pro" | "enterprise" }) => {
  const data = PLAN_DATA[plan];
  return (
    <Card className="bg-[#141414] border-[#202020] w-full">
      <CardHeader>
        <CardTitle className="text-white text-2xl">{data.title}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      {/* <CardContent className="text-white/90">
        <ul>
          {data.offerings.map((o, i) => (
            <li key={i}>✅ {o}</li>
          ))}
        </ul>
      </CardContent> */}
    </Card>
  );
};
