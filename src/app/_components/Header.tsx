import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const Header = () => {
  return (
    <div className="py-2 px-4 h-[56px] flex w-full max-w-[1280px] m-auto justify-between">
      <Logo />
      <Button variant={"outline"}>Log out</Button>
    </div>
  );
};
export default Header;
