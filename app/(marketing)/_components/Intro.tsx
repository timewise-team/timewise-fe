"use client";
import React from "react";

export const textContainer = {
  hidden: {
    opacity: 0,
  },
  show: (i = 1) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: i * 0.1,
    },
  }),
};
const Intro = () => {
  return (
    <div className=" flex items-center justify-center flex-col py-40">
      <div
        className="mt-20 md:mt-100 mb-4 flex items-center border shadow-sm p-4
        bg-sky-400 text-white rounded-full uppercase font-bold
        "
      >
        No 1 Schedule Management
      </div>
      <h1 className="text-3xl md:text-8xl text-center text-sky-500 mb-6">
        Welcome to TIMEWISE
      </h1>
      <div
        className="text-3xl md:text-8xl bg-gradient-to-r
        from-blue-400 to bg-sky-400 text-white px-4 p-2 rounded-lg pb-4 w-fit"
      >
        Work Forward
      </div>
    </div>
  );
};

export default Intro;
