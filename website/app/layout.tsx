import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ChatBox } from "find-x-ai";
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
      <body className={`font-sans overflow-y-scroll text-white`}>
        {children}
        <Toaster richColors={false} />
        <ChatBox
          config={{
            findx_key: process.env.NEXT_PUBLIC_FINDX_KEY!,
            theme: "dark",
            default: false,
          }}
        />
      </body>
    </html>
  );
}
