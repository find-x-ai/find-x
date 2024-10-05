"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NewIndexForm } from "./create";

export function NoIndexes() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-[calc(100vh-70px)] items-center justify-center h-full px-5">
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-4 text-gray-100">
          You don&apos;t have any indexes
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white transition-all duration-300">
              Create Index
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111111] border-0 text-gray-100 p-0 max-w-[450px]">
            {/* <NewIndexForm onSuccess={() => setIsOpen(false)} /> */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
