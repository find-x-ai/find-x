import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FindX search",
  description: "The ai search engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-zinc-950"}>
        <Navbar />
        <div className="w-full max-w-[1200px] flex flex-col mx-auto">
          <div className="">{children}</div>
        </div>
        <Toaster richColors={false} />
      </body>
    </html>
  );
}
