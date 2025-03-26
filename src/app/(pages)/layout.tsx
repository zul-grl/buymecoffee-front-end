import Header from "../_components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="">{children}</div>
    </div>
  );
}
