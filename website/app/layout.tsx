import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import AiChat from "@/components/AiChat";

export const metadata: Metadata = {
  title: "findx - ai",
  description: "ai chat for web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans overflow-y-scroll">
        <Navbar />
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-[1200px]">{children}</div>
        </div>
        <Toaster richColors={false} />
        <AiChat />
      </body>
    </html>
  );
}
