"use client";
import Image from "next/image";
import React from "react";

const Intro = () => {
  return (
    <div className="relative px-[10%] py-16 grid grid-cols-1 lg:grid-cols-2">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/banner/3.png')] bg-cover bg-fixed opacity-100 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-black before:opacity-50 backdrop-blur-sm"></div>
      <div className="relative z-10 text-white pt-10">
        <h1 className="font-extrabold text-5xl">
          Transform Your Workday Efficiency
        </h1>
        <p className="text-lg mt-3 leading-10">
          Discover a suite of tools designed to enhance your productivity,
          streamline your tasks, and synchronize your team&apos;s efforts
          seamlessly.
        </p>
        <h3 className="text-xl font-semibold mt-5">Why Choose Our Platform?</h3>
        <ul className="my-3 leading-10">
          <li>Intuitive drag-and-drop project boards.</li>
          <li>Comprehensive calendar integrations.</li>
          <li>Advanced task management with real-time updates.</li>
        </ul>
      </div>
      <div className="relative z-100 top-10">
        <Image
          width={700}
          height={700}
          src="/images/banner/3.png"
          alt="hero image of productivity tools"
          className="w-full h-auto object-contain z-100 rounded-sm"
        />
      </div>
    </div>
  );
};

export default Intro;
