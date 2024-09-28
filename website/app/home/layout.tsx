import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="gradient-bg pt-12">
      <div className="w-full flex justify-center">
        <Navbar />
      </div>
      <div className="w-full max-w-[1200px] mx-auto sm:px-10 px-5 pb-20">
        {children}
      </div>
      <Footer />
    </main>
  );
}
