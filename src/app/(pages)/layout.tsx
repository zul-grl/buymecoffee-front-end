import Header from "../_components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="max-w-[1280px] h-[93%] w-full m-auto">{children}</div>
    </div>
  );
}
