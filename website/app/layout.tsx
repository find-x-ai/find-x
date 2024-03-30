import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import {Toaster} from "sonner"
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: "#000212"
        }
      }}
    >
      <html lang="en">
        <body className="font-sans overflow-y-scroll">
          <Navbar />
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[1200px]">{children}</div>
          </div>
          <Toaster richColors={false}/>
        </body>
      </html>
    </ClerkProvider>
  );
}
