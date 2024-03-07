import type { Metadata } from "next";
import { MuseoModerno } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
const Muse = MuseoModerno({subsets: ["vietnamese"]});

export const metadata: Metadata = {
  title: "Find-X",
  description: "AI based chat for your app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={Muse.className}>
        <Navbar/>
        {children}
        <Toaster />
      </body>
    </html>
  );
}