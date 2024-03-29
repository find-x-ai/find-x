import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";

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
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans">
          <Navbar />
          <div className="w-full flex flex-col items-center ">
            <div className="w-full max-w-[1200px]">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
