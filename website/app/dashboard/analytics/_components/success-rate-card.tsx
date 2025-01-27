import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import CountUp from "react-countup";

export const SuccessRateCard = ({
  rate,
  loading,
}: {
  rate: number;
  loading: boolean;
}) => {
  return (
    <Card
      className={`bg-[#181818] border-[#202020] ${loading && "animate-pulse"}`}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#f8f8f8]">
          Success Rate
        </CardTitle>
        <CardDescription>Success Rate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:gap-2 gap-3 items-center space-x-2">
          <strong className="text-3xl md:text-4xl font-bold gradient-text mr-auto">
            <CountUp duration={2.5} start={0} end={rate} />%
          </strong>
        </div>
      </CardContent>
    </Card>
  );
};
