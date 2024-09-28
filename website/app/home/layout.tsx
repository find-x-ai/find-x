import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="gradient-bg pt-20">
      <div className="w-full flex justify-center">
        <Navbar />
      </div>
      <div className="w-full max-w-[1000px] mx-auto sm:px-10 px-8 pb-20">{children}</div>
      <Footer />
    </main>
  );
}
