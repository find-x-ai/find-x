"use client";
import Link from "next/link";
import {
  CircleGauge,
  AppWindow,
  LineChart,
  Menu,
  Wallet,
  Activity,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NoApps from "./noApps";
import Applist from "./applist";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Dashboard({
  apps,
  user
}: {
  apps: [{id: string; name: string; status: string; date: string; url: string , key: string }], user: {name: string , wallet: number}
}) {

  return (
    <div className="grid min-h-[calc(100vh-50px)] border-x border-[#16193d] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r border-[#16193d] md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
              >
                <AppWindow className="h-4 w-4" />
                All apps
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  0
                </Badge>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
              >
                <CircleGauge className="h-4 w-4" />
                Running
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
              >
                <Activity className="h-4 w-4" />
                Usage
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
              >
                <LineChart className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card className="bg-[#000212] border-[#16193d]">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle className="text-white">Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full bg-[#5D69D3] rounded-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full overflow-auto">
        <header className="flex h-14 items-center gap-4 border-b border-[#16193d] px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden bg-[#5D69D3] border-[#16193d]"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="flex flex-col pt-20 border-[#16193d]"
            >
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
                >
                  <AppWindow className="h-4 w-4" />
                  All apps
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    0
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
                >
                  <CircleGauge className="h-4 w-4" />
                  Running
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
                >
                  <Activity className="h-4 w-4" />
                  Usage
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
                >
                  <LineChart className="h-4 w-4" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card className="bg-[#000212] border-[#16193d]">
                  <CardHeader>
                    <CardTitle className="text-white">Upgrade to Pro</CardTitle>
                    <CardDescription>
                      Unlock all features and get unlimited access to our
                      support team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      className="w-full bg-[#5D69D3] rounded-full"
                    >
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex justify-between">
            <h2 className="text-2xl">Hello , {user.name}</h2>
            <div className="flex gap-5 items-center">
              {/* <Wallet className="h-6 w-6 text-zinc-300" /> */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5D69D3]/90 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5D69D3]"></span>
              </span>
              <p className="text-xl font-semibold">{user.wallet} $</p>
            </div>
          </div>
        </header>
        <main className="flex flex-1 p-5">
          <div className="flex flex-col relative flex-1 border border-dashed border-[#16193d] rounded-2xl w-full overflow-auto">
            {apps?.length < 1 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                <NoApps />
              </div>
            ) : (
              <Applist appsArray={apps} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
