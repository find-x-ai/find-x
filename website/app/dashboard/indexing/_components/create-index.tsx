"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { createIndex } from "@/actions/indexing";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/loader";

export function CreateIndex({
  text,
  heading,
}: {
  text: string;
  heading: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleCreateIndex = async (formData: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    setLoading(true);
    const url = formData.get("url") as string;
    const name = formData.get("name") as string;
    const res = await createIndex(name, url, new Date());
    if (res.success && res.name) {
      toast.success(res.message);
      setOpen(false);
      router.refresh();
      router.push(`/dashboard/indexing/${res.name}?logs=open`);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div
      className={`${
        heading &&
        "flex flex-col items-center justify-center h-full w-full space-y-4"
      }`}
    >
      {heading && (
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl sm:text-3xl  font-semibold text-white">
            No indexes found
          </h1>
          <p className="text-sm text-gray-500 max-w-[300px] text-center">
            Start indexing your website by clicking the button below
          </p>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-700 hover:bg-emerald-800 border-emerald-300 border">
            {text}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-transparent border-none text-white">
          <Card className="bg-[#111111]  border-[#202020] rounded-md">
            <CardHeader>
              <CardTitle className=" text-2xl font-semibold text-white">
                Create New Index
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Fill the details below to create a new index
              </CardDescription>
            </CardHeader>
            <form
              action={handleCreateIndex}
              className="w-full max-w-[800px] text-white"
            >
              <CardContent>
                <div className="flex flex-col  gap-5 w-full">
                  <div className="flex flex-1 flex-col space-y-2">
                    <Label>URL</Label>
                    <Input
                      name="url"
                      type="url"
                      required
                      placeholder="https://example.com/"
                      className="border-[#202020]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col space-y-2">
                    <Label>Name</Label>
                    <Input
                      name="name"
                      type="text"
                      required
                      minLength={3}
                      maxLength={50}
                      placeholder="Enter a name for the index"
                      className="border-[#202020] autofill:fill-[#111]"
                    />
                  </div>
                </div>
                <p className="text-sm text-[#757575] pt-5 px-1">
                  By clicking create you agree to the rules and regulations of
                  fnd-x.
                </p>
              </CardContent>

              <CardFooter className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button
                    disabled={loading}
                    type="button"
                    variant={"outline"}
                    className="bg-transparent w-[100px] text-white border-[#202020] hover:bg-transparent hover:text-white"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  disabled={loading}
                  type="submit"
                  className="bg-emerald-700 w-[110px] border border-emerald-300 hover:bg-emerald-800 text-white flex items-center gap-2"
                >
                  {loading && (
                    <Loader className="animate-spin transition-all" />
                  )}
                  <span className="transition-all duration-300">
                    {loading ? "Creating..." : "Create"}
                  </span>
                </Button>
              </CardFooter>
            </form>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
