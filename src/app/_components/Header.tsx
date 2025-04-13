"use client";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { logout } = useUser();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="py-2 px-4 h-[56px] flex w-full max-w-[1280px] m-auto justify-between">
      <Logo />
      <Button variant={"outline"} onClick={handleLogout}>
        Log out
      </Button>
    </div>
  );
};
export default Header;
