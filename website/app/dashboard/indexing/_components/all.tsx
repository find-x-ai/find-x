"use client";
import React from "react";
import { CreateIndex } from "./create-index";
import { Button } from "@/components/ui/button";
import { Index } from "@/actions/types";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AllIndexes({ indexes }: { indexes: Index[] }) {
  const router = useRouter();
  return (
    <main className="w-full h-full">
      {" "}
      {indexes.length === 0 ? (
        <CreateIndex text="Create Index +" heading={true} />
      ) : (
        <div className="flex flex-col w-full h-full max-w-6xl mx-auto">
          <IndexpageHeader />
          <div className="flex flex-col w-full h-full p-5">
            <Table className="flex-shrink-0 min-w-[600px]">
              <TableHeader>
                <TableRow className="border-b border-[#282828] hover:bg-transparent">
                  <TableHead className="w-[100px] p-4 font-medium">
                    NO
                  </TableHead>
                  <TableHead className="w-[200px] p-4 font-medium">
                    Name
                  </TableHead>
                  <TableHead className="p-4 font-medium">Total Links</TableHead>

                  <TableHead className="sm:block hidden p-4 font-medium">
                    Last Deploy
                  </TableHead>
                  <TableHead className="p-4 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indexes.map((index, i) => (
                  <TableRow
                    className="cursor-pointer hover:bg-[#202020] transition-colors border  border-[#282828]"
                    onClick={() =>
                      router.push(`/dashboard/indexing/${index.id}`)
                    }
                    key={index.id}
                  >
                    <TableCell className="p-4 text-[#808080]">
                      {i + 1}
                    </TableCell>
                    <TableCell className="p-4">{index.name}</TableCell>
                    <TableCell className="p-4 text-">{index.total_links}</TableCell>

                    <TableCell className="sm:block hidden p-4">
                      <span className="text-muted-foreground">
                        {index.last_deploy.toLocaleDateString("en-US")}
                      </span>
                    </TableCell>
                    <TableCell className={`p-4 `}>
                      <p className="flex flex-row gap-2">
                        <span
                          className={`w-auto text-xs   px-2 py-1 flex-0 flex-grow-0 border rounded-full ${
                            index.status === "success"
                              ? "text-green-600 border-green-600 bg-green-600/10"
                              : index.status === "failed"
                              ? "text-red-600 border-red-600 bg-red-600/10"
                              : "text-yellow-600 border-yellow-600 bg-yellow-600/10"
                          }`}
                        >
                          {index.status.toUpperCase()}
                        </span>
                      </p>
                    </TableCell>
                    {/* <TableCell className="p-4">
                      <Button className="text-white hover:text-white bg-transparent border border-[#282828]" variant="outline">
                        Try
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </main>
  );
}

const IndexpageHeader = () => {
  return (
    <div className="flex justify-between items-center p-5 w-full">
      <h1 className="text-2xl font-bold">Indexes</h1>
      <CreateIndex text="Create Index +" heading={false} />
    </div>
  );
};
