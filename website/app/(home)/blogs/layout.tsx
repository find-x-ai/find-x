import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Blogs about FIND-X",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto pt-10 min-h-[calc(100vh-60px)]">{children}</main>
  );
}
