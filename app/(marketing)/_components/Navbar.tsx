"use client";
import React from "react";
import { Button } from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { signIn } from "next-auth/react";

const Navbar = () => {
  const handleSignIn = async () => {
    await signIn("google", { redirectTo: "/organization/calender" });
  };

  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center z-10">
      <div className="md:max-w-screen-xl mx-auto flex items-center justify-between w-full">
        <Logo />
        <div className="hidden md:flex items-center space-x-20 m-auto"></div>
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button onClick={handleSignIn}>Get TimeWise For Free</Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
