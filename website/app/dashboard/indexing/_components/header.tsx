import { Index } from "@/actions/types";
import { RotateCw, Settings, Trash2 } from "lucide-react";
import { SetStateAction, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { deleteIndex, redeploy } from "@/actions/indexing";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useIndex } from "@/context/index-context";

interface Log {
  tag?: string;
  message: string;
  timestamp: number;
}

export const Header = () => {
  const { index, setIndex } = useIndex();
  const [deployementType, setDeployementType] = useState<
    "override" | "new" | undefined
  >();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [redeployLoading, setRedeployLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");

  const router = useRouter();

  const handleRedeploy = async () => {
    if (!deployementType) return;
    await new Promise((res) => setTimeout(res, 0));
    setRedeployLoading(true);
    const res = await redeploy(
      index!.id.toString(),
      index!.url,
      deployementType
    );
    if (res.success) {
      toast.success(res.message);
      setIndex({ ...index!, status: "deploying" });
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setDialogOpen(false);

    setDeployementType(undefined);
    setRedeployLoading(false);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const res = await deleteIndex(index!.id.toString());
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    router.refresh();
    setDeleteLoading(false);
    setAlertOpen(false);
    setDeleteConfirmation("");
  };

  return (
    <div className="w-full p-4 border-b border-[#202020] flex md:flex-row flex-col gap-5 justify-between items-center">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-2xl font-semibold">{index?.name}</h1>
        <p className="text-[#656565] text-sm">
          {index?.created_at.toLocaleString("en-us")}
        </p>
      </div>
      <div className="flex w-full md:justify-end justify-start gap-3">
        <div
          className={`flex items-center gap-2 border px-3 py-1 rounded-md ${
            index?.status === "success"
              ? "border-green-500 text-green-500 bg-green-600/10"
              : index?.status === "deploying"
              ? "border-yellow-500 text-yellow-500 bg-yellow-600/10"
              : "border-red-500 text-red-500 bg-red-600/10"
          }`}
        >
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                index?.status === "success"
                  ? "bg-green-600"
                  : index?.status === "deploying"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                index?.status === "success"
                  ? "bg-green-600"
                  : index?.status === "deploying"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            ></span>
          </span>
          <div>
            <span className="text-sm sm:text-md">
              {index?.status === "success"
                ? "Ready"
                : index?.status === "deploying"
                ? "Deploying"
                : "Failed"}
            </span>
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div>
              <button
                disabled={index?.status === "deploying"}
                className="px-3 py-2 md:w-[120px] group hover:bg-[#181818] disabled:cursor-not-allowed disabled:opacity-50 rounded-md border border-[#202020] flex items-center justify-center gap-2"
              >
                <span className="sm:block hidden">Redeploy</span>{" "}
                <RotateCw
                  className={`w-5 h-5 transition-transform duration-700 ${
                    index?.status !== "deploying" && "group-hover:rotate-[360deg]"
                  } text-[#656565]`}
                />
              </button>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-transparent border-none text-white">
            <Card className="bg-[#141414] border-[#202020] p-5 space-y-2 min-w-[300px]">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl text-white">
                  Redeploy Options
                </CardTitle>
              </CardHeader>
              <form
                className="m-0 rounded-none bg-transparent border-none"
                action={handleRedeploy}
              >
                <CardContent className="p-0 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-[#959595]">
                      Select Deployement Type
                    </Label>
                    <Select
                      value={deployementType}
                      onValueChange={(v: "override" | "new") =>
                        setDeployementType(v)
                      }
                      required
                    >
                      <SelectTrigger className="text-white">
                        <SelectValue placeholder="Choose here" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="override">
                          Override old pages (old pages won't be removed)
                        </SelectItem>
                        <SelectItem value="new">
                          Remove Old pages ( all old pages will be removed )
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-yellow-600/10 p-2 rounded-md border border-yellow-600 text-yellow-600 text-sm">
                    Note: Removing old pages will have a downtime until
                    deployment is completed, so make sure to select that option
                    only when there are changes in URLs of pages to prevent old
                    pages being shown in search results.
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-0 pt-3">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="bg-transparent border-[#353535] text-white hover:bg-transparent hover:text-white"
                      variant={"outline"}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    className={`flex items-center gap-2 ${
                      redeployLoading ? "w-[110px]" : "w-[70px]"
                    } transition-all`}
                    type="submit"
                    variant={"ui"}
                  >
                    {redeployLoading && <Loader />}
                    <span>{redeployLoading ? "Starting..." : "Start"}</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </DialogContent>
        </Dialog>
        <div>
          <AlertDialog open={alertOpen}>
            <AlertDialogTrigger asChild>
              <button
                onClick={() => setAlertOpen(true)}
                className={`px-3 disabled:cursor-not-allowed disabled:opacity-50 py-2 md:w-[120px] group bg-red-600 ${
                  status !== "deploying" && "hover:bg-red-700"
                } text-white rounded-md border border-red-600 flex items-center justify-center gap-2`}
              >
                <span className="sm:block hidden">Delete</span>
                <Trash2 className="w-5 h-5" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#111] tetx-white border-[#202020]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  <b className="text-white">{index?.name}</b> and remove its
                  data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-4 flex flex-col space-y-4">
                <Label className="text-white">
                  Type "delete {index?.name}" to confirm:
                </Label>
                <Input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="mt-1 p-2 border border-[#202020] bg-transparent ring-0 rounded-md"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={deleteLoading}
                  onClick={() => setAlertOpen(false)}
                  className="bg-transparent border-[#353535]"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className={`bg-red-600 flex items-center disabled:cursor-not-allowed gap-2 text-white hover:bg-red-700 ${
                    deleteConfirmation !== `delete ${index?.name}`
                      ? "opacity-50"
                      : ""
                  }`}
                  disabled={deleteConfirmation !== `delete ${index?.name}`}
                >
                  {deleteLoading && <Loader />}
                  <span>
                    {deleteLoading ? "Deleting..." : "Confirm Delete"}{" "}
                  </span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
