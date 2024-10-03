"use client";
import React, { useState } from "react";

export const productivityList = [
  {
    title: "Board",
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa, a laborum non praesentium enim ipsum suscipit dignissimos voluptates eaque.",
    img: "/images/task-management.webp",
  },
  {
    title: "Calender",
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa, a laborum non praesentium enim ipsum suscipit dignissimos voluptates eaque.",
    img: "/images/task-management.webp",
  },
  {
    title: "Task Management",
    description:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa, a laborum non praesentium enim ipsum suscipit dignissimos voluptates eaque.",
    img: "/images/task-management.webp",
  },
];

const Banner = () => {
  const [itemIndex, setItemIndex] = useState(0);
  return (
    <div className="px-[10%] py-10">
      <p>List Section</p>
      <h1 className="font-semibold tex-4xl">A Productivity Software</h1>
      <p className="w-full lg:w-1/2 text-xl my-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa, a
        laborum non praesentium enim ipsum suscipit dignissimos voluptates
        eaque.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col justify-between py-4 leading-normal">
          {productivityList.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer p-3 rounded-md ${
                index === itemIndex
                  ? "bg-white md:border-l-4 md:border-[#00c7e5]"
                  : ""
              }`}
              onClick={() => setItemIndex(index)}
            >
              <h5 className="mb-2 text-lg font-old tracking-tight">
                {item.title}
              </h5>
              <p className="mb-3 font-normal text-gray-700">
                {item.description}{" "}
              </p>
            </div>
          ))}
        </div>
        <img
          src={`/images//banner/${itemIndex + 1}.webp`}
          alt=""
          className="object-cover w-full rounded-t-lg h-auto"
        />
      </div>
    </div>
  );
};

export default Banner;
