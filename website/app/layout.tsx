import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import "./globals.css";
import { ChatBox } from "find-x-ai";

const roboto = Roboto({weight: "400" , subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Find-X",
  description: "The most comprehensive ai search for web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className + " bg-[#FFFFFF]"}>
        <Navbar />
        <div className="w-full max-w-[1200px] flex flex-col mx-auto">
          <div className="">{children}</div>
        </div>
        <Toaster richColors={false} />
        <Footer />
        <ChatBox
          config={{
            findx_key: process.env.NEXT_PUBLIC_FINDX_KEY!,
            theme: "dark",
            default: true,
          }}
        />
      </body>
    </html>
  );
}
