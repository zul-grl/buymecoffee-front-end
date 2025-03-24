import Image from "next/image";
import { CoffeeLogo, Logo } from "../_components/Logo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-screen h-screen">
      <div className="bg-amber-400 w-[50vw] flex justify-center items-center relative">
        <Logo />
        <div className="text-foreground flex flex-col gap-10 items-center max-w-[455px]">
          <CoffeeLogo />
          <div>
            <p className="text-[24px] text-center mb-3 font-bold">
              Fund your creative work
            </p>
            <p className="text-[16px] text-center">
              Accept support. Start a membership. Setup a shop. It’s easier than
              you think.
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
