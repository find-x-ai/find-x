import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ChatBox } from "find-x-ai";

export const metadata: Metadata = {
  title: "FIND-X | Home",
  description: "Perplexity for your website",
  category: "technology",
  icons: [
    {
      url: "/favicon.ico",
      sizes: "any",
      type: "image/x-icon",
    },
  ],
  openGraph: {
    title: "FIND-X | Home",
    description: "Perplexity for your website",
    url: "https://find-x.tech",
    siteName: "FIND-X",
    images: [
      {
        url: "https://find-x.tech/preview.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIND-X | Home",
    description: "Perplexity for your website",
    images: [
      {
        url: "https://find-x.tech/preview.png",
        width: 1200,
        height: 630,
        type: "image/png",
      },
    ],
  },
  keywords: [
    "FIND-X",
    "find-x ai",
    "find x ai",
    "Perplexity",
    "Perplexity for your website",
    "Perplexity for Next.js",
    "Perplexity for React.js",
    "local search engine",
    "RAG",
    "RAG as a Service",
    "AI powered search engine",
    "Internal search",
    "Local search",
  ],
  creator: "Sahil",
  robots: "index, follow",
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
