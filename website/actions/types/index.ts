import { ScrapedData } from "@/types";

export type Index = {
  created_at: Date;
  id: number;
  url: string;
  api_key: string;
  status: "queued" | "deploying" | "failed" | "success";
  total_links: number;
  name: string;
  last_deploy: Date;
  user_id: number;
  content: {
    data: ScrapedData[];
  };
};
