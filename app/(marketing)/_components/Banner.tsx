import { Button } from "@/components/ui/Button";
import React from "react";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="w-screen flex flex-col">
      {/* wrapper */}
      <div className="relative w-full sm:h-full h-[826px] box-border overflow-hidden mx-auto mb-0">
        {/* bg image */}
        <img
          className="w-full h-full object-cover"
          src="/images/bannerSolution.webp"
          alt="bannerSolution"
        />
        {/* container */}
        <div className="absolute gap-20 inset-0 m-auto w-full h-full flex md:flex-row flex-col items-center justify-center box-border py-0 px-4">
          {/* content */}
          <div className="max-w-[418px] flex flex-col sm:items-start px-4 sm:px-0 items-center gap-5 text-white not-italic">
            {/* title */}
            <div className="text-2xl font-bold tracking-[1px] uppercase">
              <h1 className="">Welcome to TIMEWISE</h1>
            </div>
            {/* des */}
            <div className="text-lg font-normal leading-6 tracking-[0.16px]">
              Dive into the Timewise : schedule management while enhancing
              productivity. It’s health empowerment in your hands. Join now, and
              make your work count.{" "}
            </div>
            {/* action */}
            <Button className="uppercase py-3 px-7 rounded-2xl bg-[#346af7] transition-all duration-300 ease-in-out hover:bg-[#346af7] border-0 cursor-pointer">
              <div className="text-white text-center text-base font-semibold leading-6 tracking-wide uppercase">
                Become a member
              </div>
            </Button>
          </div>
          <Image
            src="/images/icons/timewise-logo.svg"
            alt="timewise"
            width={518}
            height={518}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
