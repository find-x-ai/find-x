"use client";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { configureNewApp } from "@/app/actions/apps";
import { checkURL } from "@/app/actions/url";
import { useState } from "react";
import { useRouter } from "next/navigation";
const newApp = () => {

  const [loading, setLoading] = useState<boolean>(false);

  const fakeLoad = async () => {
    return;
  };
  const handleConfigureApp = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    if (name.length < 3) {
      toast.warning("name must be at least 3 characters");
    }
    await fakeLoad();
    setLoading(true);
    const urlCheck = await checkURL({ url: url });
    if (!urlCheck.status) {
      toast.warning("Invalid url");
    } else {
      const res = await configureNewApp({ name: name, url: url });

      if (res.status) {
        toast.success(res.message);
        window.location.reload();
      }else{
        toast.error(res.message);
      }
    }
    setLoading(false);
  };
  return (
    <Dialog>
      <DialogTrigger className="mt-4 p-2 rounded-md bg-[#5D69D3] hover:bg-[#5D69D3]/80">
        New app
      </DialogTrigger>
      <DialogContent className="border-[#292e67]/40 bg-gradient-to-b from-[#11132C] bg-no-repeat via-background to-black">
        <form action={handleConfigureApp}>
          <Card className="bg-transparent border-0 text-white">
            <CardHeader>
              <CardTitle>Configure app</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Name</Label>
              <Input
                required
                name="name"
                placeholder="enter your app name"
                className="border-[#292e67]"
              />
              <Label>URL</Label>
              <Input
                required
                name="url"
                placeholder="https://example.com/"
                className="border-[#292e67]"
              />
            </CardContent>
            <CardFooter className=" sm:justify-end justify-between gap-5">
              <DialogClose>
                <Button
                  type="button"
                  variant={"outline"}
                  className="border-[#292e67] hover:bg-transparent hover:text-white sm:w-auto w-full"
                >
                  cancel
                </Button>
              </DialogClose>
              <Button
               disabled={loading}
                type="submit"
                className="bg-[#5D69D3] hover:bg-[#5D69D3]/80 sm:w-[120px] w-full"
              >
                {loading ? (
                  <Loader className=" animate-spin text-white" />
                ) : (
                  "Configure now"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default newApp;
