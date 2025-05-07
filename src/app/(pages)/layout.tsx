"use client";
import { useRouter } from "next/navigation";
import Header from "../_components/Header";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/sign-up");
    }
  }, []);
  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="max-w-[1280px] h-[93%] w-full m-auto">{children}</div>
    </div>
  );
}
