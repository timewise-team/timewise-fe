"use client";
import React, { useState } from "react";
import Image from "next/image";

export const productivityList = [
  {
    title: "Board",
    description:
      "Organize your projects visually with our interactive boards. Drag and drop tasks as they progress through stages, and customize columns to fit your workflow. Perfect for teams looking to visualize project milestones and individual responsibilities.",
    img: "/images/board-management.webp",
  },
  {
    title: "Calendar",
    description:
      "Keep track of deadlines, meetings, and events with our integrated calendar. Sync with external calendars to ensure you never miss an important date. Use our drag-and-drop interface to reschedule tasks and events effortlessly.",
    img: "/images/calendar-management.webp",
  },
  {
    title: "Schedule Management",
    description:
      "Manage daily tasks with efficiency. Set priorities, deadlines, and assignees. Receive notifications for upcoming deadlines and changes to task status. Utilize filters to view tasks by date, project, or priority.",
    img: "/images/task-management.webp",
  },
];

const Banner = () => {
  const [itemIndex, setItemIndex] = useState(0);
  return (
    <div className="px-[10%] py-10 bg-sky-100">
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
                  ? "bg-gray-200 md:border-l-4 md:border-[#00c7e5]"
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
        <Image
          src={`/images/banner/${itemIndex + 1}.png`}
          alt=""
          width={1000}
          height={1000}
          quality={100}
          className="w-[100%] h-[600px]  object-cover rounded-t-lg 
          "
        />
      </div>
    </div>
  );
};

export default Banner;
