import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ChatBox } from "find-x-ai";

// good seo need to be done
export const metadata: Metadata = {
  title: "FIND-X | Home",
  description: "The Most Comprehensive AI Search for Web",
  icons: [
    {
      url: "/favicon.ico",
      sizes: "any",
      type: "image/x-icon",
    },
  ],
  openGraph: {
    title: "FIND-X | Home",
    description: "The Most Comprehensive AI Search for Web",
    url: "https://find-x.tech",
    siteName: "FIND-X",
    images: [
      {
        url: "https://find-x.tech/preview.png",
        width: 1200,
        height: 630,
      },
    ],
  },
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
