import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import NewApp from "./newApp";
import { Settings, Eye, EyeOff, Loader } from "lucide-react";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { deleteApp } from "@/app/actions/apps";
import { toast } from "sonner";
const AppList = ({
  appsArray,
}: {
  appsArray: {
    id: string;
    name: string;
    status: string;
    date: string;
    url: string;
    key: string;
  }[];
}) => {

  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [disabledDelete, setDisabledDelete] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
  };

  const toggleKeyVisibility = () => {
    setShowKey(!showKey);
  };

  const fakeLoad = async () => {
    return;
  };
  const handleDelete = async ({ id, key }: { id: string; key: string }) => {
    await fakeLoad();
    setLoading(true);
    const res = await deleteApp({ id: id, key: key });
    if (res.status) {
      toast.success(res.message);
      window.location.reload();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-1 flex-col justify-between items-end ">
      <Table className="">
        <TableHeader className=" border-b-0 border-[#16193d]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[50px]">Sr.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appsArray.map((app, i) => (
            <TableRow key={i}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{app.name}</TableCell>
              <TableCell className="text-yellow-400">{app.status}</TableCell>
              <TableCell>{app.date}</TableCell>
              <TableCell>{app.url}</TableCell>
              <TableCell aria-disabled>
                <Dialog>
                  <DialogTrigger>
                    <Settings />
                  </DialogTrigger>
                  <DialogContent className="border-[#292e67]/40 bg-gradient-to-b from-[#11132C] bg-no-repeat via-background to-black">
                    <DialogHeader>
                      <DialogTitle className="font-semibold text-3xl">
                        {app.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Label>URL</Label>
                      <Input
                        className="border-[#292e67] disabled:opacity-100"
                        disabled
                        value={app.url}
                      />{" "}
                      <br />
                      <Label>API KEY</Label>
                      <div className="flex items-center px-1 border border-[#292e67] rounded-md">
                        <Input
                          className="disabled:opacity-100 border-0 bg-transparent"
                          disabled
                          type={showKey ? "text" : "password"}
                          value={app.key}
                        />
                        {showKey ? (
                          <EyeOff
                            className="bg-transparent"
                            onClick={toggleKeyVisibility}
                          />
                        ) : (
                          <Eye
                            className="bg-transparent"
                            onClick={toggleKeyVisibility}
                          />
                        )}
                      </div>
                      <div className="flex w-full justify-end gap-5">
                        <Button
                          onClick={() => handleCopy(app.key)}
                          className="text-white bg-green-700 hover:bg-green-800"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger className=" border p-2 rounded-md border-red-500 text-red-500 hover:bg-transparent hover:text-red-700">
                      delete
                  </DialogTrigger>
                  <DialogContent className="border-[#292e67]/40 bg-gradient-to-b from-[#11132C] bg-no-repeat via-background to-black">
                    <DialogHeader>
                      <DialogTitle className="font-semibold text-3xl">
                        Are you sure ?
                      </DialogTitle>
                      <DialogDescription className="text-zinc-400">
                        This action can't be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Label>
                        Type{" "}
                        <span className="py-1 px-2 bg-black rounded-md font-mono">
                          delete {app.name}
                        </span>
                      </Label>
                      <Input
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          if (event.target.value === `delete ${app.name}`) {
                            setDisabledDelete(false);
                          } else {
                            setDisabledDelete(true);
                          }
                        }}
                        className="border-[#292e67]"
                        placeholder=""
                      />
                    </div>
                    <DialogFooter>
                      <DialogClose className="w-full p-2 bg-black border border-[#292e67] rounded-md">
                        cancel
                      </DialogClose>
                      <Button
                        onClick={() =>
                          handleDelete({ id: app.id, key: app.key })
                        }
                        disabled={disabledDelete}
                        className="w-full"
                        variant={"destructive"}
                      >
                        {loading ? (
                          <Loader className="text-white animate-spin" />
                        ) : (
                          "Delete app"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="pb-2 pr-2">
        <NewApp />
      </div>
    </div>
  );
};

export default AppList;
