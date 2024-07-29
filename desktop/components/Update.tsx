"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { invoke } from "@tauri-apps/api/tauri";
import { db } from "@/lib/db";

type ClientData = {
  id: string;
  joined_at: Date | string;
  url: string;
  name: string;
  plan: string;
  api_key: string;
  email: string;
  total_requests: number;
  remaining: number;
};

const Update = ({ client }: { client: ClientData }) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [appUpdateLoading, setAppUpdateLoading] = useState<boolean>(false);
  const [detailsUpdateLoading, setDetailsUpdateLoading] =
    useState<boolean>(false);
  const [data, setData] = useState<{
    name: string;
    url: string;
    plan: string;
    email: string;
  }>({
    name: client.name,
    url: client.url,
    plan: client.plan,
    email: client.email,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setData((prevData) => ({
      ...prevData,
      plan: value,
    }));
  };

  const handleUpdateApp = async () => {
    const { name, url, plan, email } = data;

    setAppUpdateLoading(true);
    try {
      const res = (await invoke("check_url", { url: url })) as boolean;

      const db_res = await db(`SELECT remaining FROM clients where id = $1`, [
        parseInt(client.id),
      ]);

      if (!db_res || db_res.length === 0) {
        throw new Error("Client not found");
      }

      const old_data = db_res[0] as ClientData;

      if (res) {
        if (data.plan !== "0") {
          await db(
            `UPDATE clients SET name = $1 , email = $2 , url = $3 , plan = $4 , remaining = $5  WHERE id = $5`,
            [
              name,
              email,
              url,
              plan,
              parseInt(client.id),
              old_data.remaining + parseInt(plan),
            ]
          );
        } else {
          await db(
            `UPDATE clients SET name = $1 , email = $2 , url = $3  WHERE id = $4`,
            [name, email, url, parseInt(client.id)]
          );
        }

        toast.success("Updated project successfully!");

        await new Promise((res) => setTimeout(res, 1500));

        await invoke("set_item", {
          key: "new",
          value: JSON.stringify({
            id: client.id,
            name: name,
            url: url,
            plan: plan,
            email: email,
            update: true,
          }),
        });

        setDialogOpen(false);
        router.push(`/new`);
      } else {
        toast.error("Invalid URL");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error: " + error);
    } finally {
      setAppUpdateLoading(false);
    }
  };

  const handleUpdateDetails = async () => {
    setDetailsUpdateLoading(true);
    const { name, url, plan, email } = data;
    try {
      const res = (await invoke("check_url", { url: data.url })) as boolean;

      const db_res = await db(`SELECT remaining FROM clients where id = $1`, [
        parseInt(client.id),
      ]);

      if (!db_res || db_res.length === 0) {
        throw new Error("Client not found");
      }

      const old_data = db_res[0] as ClientData;

      if (!res) {
        throw new Error("Invalid url");
      }
      if (data.plan !== "0") {
        await db(
          `UPDATE clients SET name = $1 , email = $2 , url = $3 , plan = $4 , remaining = $6  WHERE id = $5`,
          [
            name,
            email,
            url,
            plan,
            parseInt(client.id),
            old_data.remaining + parseInt(plan),
          ]
        );
      } else {
        await db(
          `UPDATE clients SET name = $1 , email = $2 , url = $3  WHERE id = $4`,
          [name, email, url, parseInt(client.id)]
        );
      }
      toast.success("Updated project successfully!");

      await new Promise((res) => setTimeout(res, 1500));

      return window.location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Error: " + error);
    } finally {
      setDetailsUpdateLoading(false);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger
        className="p-2 text-white w-[100px] transition-all duration-1000 ease-in-out bg-zinc-900 border bg-gradient-to-r from-zinc-800 via-zinc-900 to-zinc-950 hover:from-zinc-900 hover:via-zinc-950 hover:to-zinc-800 border-zinc-500 hover: rounded-md"
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        update
      </DialogTrigger>
      <DialogContent className="bg-black border border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl px-3">
            Update {client.name}{" "}
          </DialogTitle>
        </DialogHeader>
        <div className="w-full h-full flex flex-col p-3">
          <form
            onSubmit={handleUpdateApp}
            className="w-full flex flex-col gap-5"
          >
            <div className="w-full flex gap-5">
              <div className="w-full space-y-2">
                <Label htmlFor="name">App Name</Label>
                <Input
                  autoFocus
                  autoComplete="off"
                  value={data.name}
                  onChange={handleInputChange}
                  className="bg-zinc-950 border-zinc-800"
                  placeholder="Enter app name"
                  type="text"
                  required
                  id="name"
                  name="name"
                />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  autoComplete="off"
                  value={data.url}
                  onChange={handleInputChange}
                  className="bg-zinc-950 border-zinc-800"
                  placeholder="https://example.com/"
                  type="text"
                  required
                  id="url"
                  name="url"
                />
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="off"
                value={data.email}
                onChange={handleInputChange}
                className="bg-zinc-950 border-zinc-800"
                placeholder="example@example.com"
                type="email"
                required
                id="email"
                name="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="select">Plan</Label>
              <Select required name="plan" onValueChange={handleSelectChange}>
                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-400">
                  <SelectGroup>
                    <SelectLabel>Plan</SelectLabel>
                    <SelectItem value={"10"}>Free (10 $)</SelectItem>
                    <SelectItem value={"50"}>50 $ per month</SelectItem>
                    <SelectItem value={"500"}>500 $ per year</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full flex justify-end gap-5">
              <Button
                className="bg-black border-zinc-800 w-full"
                onClick={() => setDialogOpen(false)}
                variant={"outline"}
                type="button"
              >
                cancel
              </Button>
              <Button
                disabled={appUpdateLoading || detailsUpdateLoading}
                onClick={handleUpdateDetails}
                type="button"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {detailsUpdateLoading ? (
                  <Loader2 className=" animate-spin" />
                ) : (
                  "Update details"
                )}
              </Button>
              <Button
                disabled={detailsUpdateLoading || appUpdateLoading}
                onClick={handleUpdateApp}
                type="button"
                className="w-full bg-[#ff371a] hover:bg-[#ff371a]/80"
              >
                <p className="flex gap-2 items-center transition-all duration-300 ">
                  {appUpdateLoading && (
                    <Loader2 className="animate-spin duration-500 w-[20px]" />
                  )}
                  <span className="transition-all duration-300">
                    Full update
                  </span>{" "}
                </p>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { Update };
