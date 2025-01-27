"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface PricingCard {
  title: string;
  price: number;
  features: string[];
  duration: string;
}

const cards_data: PricingCard[] = [
  {
    title: "Free",
    price: 0,
    features: [
      "1000 searches per month",
      "Basic support",
      "Limited analytics",
      "Standard response time",
    ],
    duration: "Monthly",
  },
  {
    title: "Pro",
    price: 50,
    features: [
      "2000 searches per month",
      "Priority support",
      "Custom branding",
      "Detailed analytics",
    ],
    duration: "Monthly",
  },
  {
    title: "Enterprise",
    price: 500,
    features: [
      "Unlimited searches",
      "Dedicated account manager",
      "Advanced analytics",
      "Custom integrations",
      "24/7 support",
      "Access to beta features",
    ],
    duration: "Monthly",
  },
];

export function PricingComponent() {
  return (
    <div className="container mx-auto py-10 text-[#f7f8f8]">
      <h2 className="text-3xl text-center mb-12">
        It's <span className="gradient-text">worth</span> it
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards_data.map((card, index) => (
          <Card
            key={index}
            className={`flex flex-col bg-[#90909] ${
              index === 1 ? "border-emerald-600" : "border-[#181818]"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-[#f7f8f8]">
                {card.title}
              </CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold">${card.price}</span>
                <span className="text-muted-foreground">
                  /{card.duration.toLowerCase()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {card.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-[#757575]" />
                    <span className="text-[#656565]">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
              onClick={()=> toast.info("Comming Soon...")}
                className="w-full"
                variant={index === 1 ? "default" : "outline"}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
       
      </div>
      <p className="py-10 text-[#656565] text-center">Note : Find-X is currently in development and free to use!</p>
    </div>
  );
}
