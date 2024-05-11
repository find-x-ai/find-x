import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Aside from "@/components/Aside";
import {Toaster} from "sonner"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Find-X",
  description: "Internal tool for find-x",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " h-screen w-full min-w-[1000px] flex overflow-hidden"}>
        <Aside/>
        <div className="bg-zinc-950 w-full h-full">
        {children}  
        </div>
        <Toaster richColors={false} position="bottom-right"/>
      </body>
    </html>
  );
}