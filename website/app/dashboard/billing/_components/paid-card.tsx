import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PaidCard = ({ amount }: { amount: number }) => {
  return (
    <Card className="bg-[#121212] border-[#202020] w-full">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Paid</CardTitle>
        <CardDescription>Last paid amount</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-2xl text-white ">{amount}$</span>
      </CardContent>
    </Card>
  );
};
