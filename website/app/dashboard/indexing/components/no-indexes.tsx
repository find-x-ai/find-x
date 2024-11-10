"use client";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

export function NoIndexes() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">+ Create Index</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#090909]/80 border border-green-950 backdrop-blur-md text-white">
          <DialogHeader>
            <DialogTitle>Create New Index</DialogTitle>
            <DialogDescription>
              Enter the details for your new index.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Comming soon...");
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="indexName">Name</Label>
                <Input
                  required
                  className="border-[#202020]"
                  id="indexName"
                  placeholder="Enter index name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="indexUrl">URL</Label>
                <Input
                  required
                  className="border-[#202020]"
                  id="indexUrl"
                  placeholder="Enter index URL"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-green-950 hover:bg-green-900" type="submit">
                Create Index
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
