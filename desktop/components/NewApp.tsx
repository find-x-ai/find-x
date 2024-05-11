"use client"
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
  DialogDescription,
  DialogFooter,
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

const NewApp = () => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [data, setData] = useState<{ name: string; url: string; plan: string; email: string }>(
    { name: "", url: "", plan: "", email: "" }
  );
  const fakeLoad = async () => {
    return;
  };

  const handleCreateNewApp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const plan = formData.get("plan") as string;
    const email = formData.get("email") as string;

    setLoading(true);
    try {
      const res = (await invoke("check_url", { url: url })) as boolean;

      if (res) {
        setSuccess(true);
        setData({ name: name, url: url, plan: plan, email: email });
        setDialogOpen(false);
        router.push(`/new?data=${name}*${url}*${plan}*${email}`);
      } else {
        toast.error("Invalid URL");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error: " + error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger
        className="px-3 py-2 rounded-md text-amber-500 border border-amber-500 w-[130px] bg-amber-500/5"
       onClick={()=> {
        setDialogOpen(true);
      }}>
       New
      </DialogTrigger>
      <DialogContent className="bg-black border border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl px-3">Configure New App</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full flex flex-col p-3">
          <form onSubmit={handleCreateNewApp} className="w-full flex flex-col gap-5">
            <div className="w-full flex gap-5">
              <div className="w-full space-y-2">
                <Label htmlFor="name">App Name</Label>
                <Input className="bg-zinc-950 border-zinc-800 " placeholder="Enter app name" type="text" required id="name" name="name" />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input className="bg-zinc-950 border-zinc-800 " placeholder="https://example.com/" type="text" required id="url" name="url" />
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input className="bg-zinc-950 border-zinc-800 " placeholder="example@example.com" type="email" required id="email" name="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="select">Plan</Label>
              <Select required name="plan">
                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-600">
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
              <Button className="bg-black border-zinc-800" onClick={()=> setDialogOpen(false)} variant={'outline'} type="button">cancel</Button>
              <Button type="submit" className="w-[120px] bg-amber-500 hover:bg-amber-600">
                {loading ? <Loader2 className=" animate-spin" /> : "create"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewApp;
