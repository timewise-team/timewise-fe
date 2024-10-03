import React from "react";
import { Button } from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { signIn } from "@/auth";

const Navbar = () => {
  return (
    <div
      className="fixed top-0 w-full h-14 px-4 border-b-shadow-sm
    bg-white flex items-center z-100
    "
    >
      <div className="md:max-w-screen-xl mx-auto flex items-start w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-start justify-between w-full">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button>Get TimeWise For Free</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
