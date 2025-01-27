import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import CountUp from "react-countup";

export const CachedCountCard = ({
  title,
  count,
  description,
  loading,
}: {
  title: string;
  count: number;
  description: string;
  loading: boolean;
}) => {
  return (
    <Card className={`bg-[#181818] border-[#202020] ${loading && "animate-pulse"}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#f8f8f8]">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:gap-2 gap-3 items-center space-x-2">
          <strong className="text-3xl md:text-4xl font-bold gradient-text mr-auto">
            <CountUp duration={1.5} start={0} end={count} />
          </strong>
        </div>
      </CardContent>
    </Card>
  );
};
