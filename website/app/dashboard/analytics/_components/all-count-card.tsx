import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import CountUp from "react-countup";

export const CountCard = ({
  title,
  count,
  description,
}: {
  title: string;
  count: number;
  description: string;
}) => {
  return (
    <Card className="bg-[#181818] border-[#202020]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#f8f8f8]">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:gap-2 gap-3 items-center space-x-2">
          <strong className="text-3xl md:text-4xl font-bold gradient-text">
            <CountUp duration={1} start={0} end={count} />
          </strong>
        </div>
      </CardContent>
    </Card>
  );
};
