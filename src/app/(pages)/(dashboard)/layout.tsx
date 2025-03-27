"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-[74px] h-full">
      <aside className="hidden md:flex flex-col w-64 p-4 bg-white border-r">
        <div className="w-[220px] flex flex-col gap-1">
          <Link href="/">
            <Button
              className={`w-full ${pathname === "/" ? "bg-[#F4F4F5]" : ""}`}
              variant="ghost"
            >
              Home
            </Button>
          </Link>
          <Link href="/explore">
            <Button
              className={`w-full ${
                pathname === "/explore" ? "bg-[#F4F4F5]" : ""
              }`}
              variant="ghost"
            >
              Explore
            </Button>
          </Link>
          <Link href={`view`}>
            <Button
              className={`w-full ${
                pathname.includes("view") ? "bg-[#F4F4F5]" : ""
              }`}
              variant="ghost"
            >
              View Page <ExternalLink className="ml-1" size={16} />
            </Button>
          </Link>

          <Link href="/settings">
            <Button
              className={`w-full ${
                pathname === "/settings" ? "bg-[#F4F4F5]" : ""
              }`}
              variant="ghost"
            >
              Account Settings
            </Button>
          </Link>
        </div>
      </aside>

      <div className="max-h-[857px] w-full px-6  pt-[44px]  overflow-scroll">
        {children}
      </div>
    </div>
  );
}
