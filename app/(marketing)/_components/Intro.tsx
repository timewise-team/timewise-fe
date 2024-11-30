"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

const Intro = () => {
  return (
    <div className="px-[10%] py-16 grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-b from-sky-300 to-blue-600">
      <div className="text-white p-2">
        <h1 className="font-extrabold text-5xl">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Alias,
          nesciunt.
        </h1>
        <p className="text-lg mt-3 leading-10">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat,
          molestiae.
        </p>
        <h3 className="text-xl font-semibold mt-5">Lorem, ipsum dolor.</h3>
        <ul className="my-3 leading-10">
          <li>Lorem, ipsum dolor.</li>
          <li>Lorem, ipsum dolor.</li>
        </ul>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-3">
          <Input className="" type="email" />

          <Button type="submit" className="bg-black text-white">
            Sign Up For Free
          </Button>
        </div>
      </div>
      <div>
        <Image
          width={500}
          height={500}
          src="/images/header-banner.webp"
          alt="hero"
        />
      </div>
    </div>
  );
};

export default Intro;
