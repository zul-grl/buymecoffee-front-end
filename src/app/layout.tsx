import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import { ProfileProvider } from "./context/ProfileContext";
import { DonationProvider } from "./context/DonationContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}  antialiased`}>
        <UserProvider>
          <ProfileProvider>
            <DonationProvider>{children}</DonationProvider>
          </ProfileProvider>
        </UserProvider>
      </body>
    </html>
  );
}
