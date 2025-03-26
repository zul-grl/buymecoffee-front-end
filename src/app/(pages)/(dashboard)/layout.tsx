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
    <div className="w-full max-w-[1280px] mx-auto">
      <div className="w-[251px] flex flex-col gap-1">
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
        <Link href={`/profile/${123}`}>
          <Button
            className={`w-full ${
              pathname.startsWith("/profile/") && !pathname.includes("settings")
                ? "bg-[#F4F4F5]"
                : ""
            }`}
            variant="ghost"
          >
            View Page <ExternalLink className="ml-1" size={16} />
          </Button>
        </Link>

        <Link href="/profile/settings">
          <Button
            className={`w-full ${
              pathname === "/profile/settings" ? "bg-[#F4F4F5]" : ""
            }`}
            variant="ghost"
          >
            Account Settings
          </Button>
        </Link>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
