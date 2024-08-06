import { CircleCheckBig } from "lucide-react";

type Card = {
  title: string;
  price: number;
  features: string[];
  duration: string;
};

const cards_data: Card[] = [
  {
    title: "Free",
    price: 0,
    features: [
      "100 searches per month",
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
      "1,000 searches per month",
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

export const Cards = () => {
  return (
    <div className=" w-full flex flex-col md:flex-row justify-center gap-5">
      {cards_data.map((c, i) => {
        return (
          <div
            key={i}
            className="bg-zinc-200 p-6 rounded-lg w-full border border-zinc-800"
          >
            <h2 className="text-2xl font-semibold mb-4">{c.title}</h2>
            <p className="text-lg mb-4 text-green-500 font-semibold">
              Price: ${c.price}
            </p>
            <p className="text-sm mb-4 text-zinc-600">{c.duration}</p>
            <ul className="list-none list-inside mb-4 flex flex-col gap-2">
              {c.features.map((feature, index) => (
                <li key={index} className="text-sm text-zinc-800 flex gap-3">
                  <CircleCheckBig className="w-[20px] h-[20px]" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
