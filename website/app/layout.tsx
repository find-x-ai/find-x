import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
