import Back from "@/components/ui/Back";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen">
      <Back />
      {children}
    </div>
  );
}
