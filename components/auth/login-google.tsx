"use client";
// import { signIn } from "@/auth";
import React from "react";
import { Button } from "../ui/Button";

const LoginGoogle = () => {
  // const onClick = () => {
  //   signIn("google", { callbackUrl: "/" });
  // };
  return (
    <div className="flex flex-col space-y-5">
      <span className="flex items-center justify-center space-x-2">
        <span className="h-px bg-gray-400 w-14"></span>
        <span className="font-normal text-gray-500">or login with</span>
        <span className="h-px bg-gray-400 w-14"></span>
      </span>
      <div className="flex flex-col space-y-4">
        <Button
          // onClick={onClick}
          className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-gray-800 rounded-md group hover:bg-gray-800 focus:outline-none"
        >
          <span>
            <img
              className="max-w-[25px]"
              src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
              alt="Google"
            />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default LoginGoogle;
