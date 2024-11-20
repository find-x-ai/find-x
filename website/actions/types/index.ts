export type Index = {
  id: number;
  url: string;
  api_key: string;
  status: "queued" | "deploying" | "failed" | "success";
  total_links: number;
  name: string;
  last_deploy: Date;
};
