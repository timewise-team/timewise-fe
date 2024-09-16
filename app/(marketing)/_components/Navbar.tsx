import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const Navbar = () => {
  return (
    <div
      className="fixed top-0 w-full h-14 px-4 border-b-shadow-sm
    bg-white flex items-center z-100
    "
    >
      <div className="md:max-w-screen-xl mx-auto flex items-start w-full justify-between">
        {/* <Logo /> */}
        <div className="space-x-4 md:block md:w-auto flex items-start justify-between w-full">
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Timewise for free</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
