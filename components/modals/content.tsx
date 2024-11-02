/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ArchiveIcon,
  Edit,
  Gauge,
  LayoutDashboard,
  PersonStanding,
  Theater,
} from "lucide-react";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { DatePicker } from "./date-picker";
import FormInvite from "../form/form-invite";

interface Props {
  data: any;
}

const Content = ({ data }: Props) => {
  return (
    <>
      <div className="flex flex-row items-center gap-x-3 text-sm font-normal">
        <ArchiveIcon className="h-4 w-4 text-gray-500" />
        Due date:
        <DatePicker data={data} />
      </div>
      <div className="flex flex-row items-center gap-x-3 text-sm font-normal">
        <ArchiveIcon className="h-4 w-4 text-gray-500" />
        Create By: {data.first_name} {data.last_name}
      </div>
      <div className="flex flex-row items-center gap-x-3 text-sm font-normal">
        <PersonStanding className="h-4 w-4 items-center" />
        Assignee:
        <div className="flex flex-row items-center gap-x-1">
          <Image
            src={"/images/banner/5.webp"}
            alt={"avatar"}
            width={20}
            height={20}
            className="h-4 w-4 rounded-full object-cover"
          />
          <Image
            src={"/images/banner/5.webp"}
            alt={"avatar"}
            width={20}
            height={20}
            className="h-4 w-4 rounded-full object-cover"
          />
          <Image
            src={"/images/banner/5.webp"}
            alt={"avatar"}
            width={20}
            height={20}
            className="h-4 w-4 rounded-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-x-3 text-sm font-normal">
        <Theater className="h-4 w-4 items-center" />
        Tags:
        <div className="flex flex-row items-center gap-x-1">
          <span
            className={
              "w-fit px-2 py-1 leading-tight inline-flex items-center bg-yellow-200 rounded"
            }
          >
            <LayoutDashboard className="h-3 w-3 " />
            <span className={"text-sm ml-2 font-medium text-teal-900"}>
              In Progress
            </span>
          </span>{" "}
          <span
            className={
              "w-fit px-2 py-1 leading-tight inline-flex items-center bg-teal-100 rounded"
            }
          >
            <Gauge className="h-3 w-3 " />
            <span className={"text-sm ml-2 font-medium text-teal-900"}>
              Dashboard
            </span>
          </span>
        </div>
      </div>

      {/* attachment */}
      <div className="flex flex-row gap-x-3 text-sm font-normal">
        <ArchiveIcon className="h-4 w-4 text-gray-500" />
        Attachment:
      </div>
      <FormInvite data={data}>
        {/* invite member to schedule */}
        <div className="cursor-pointer flex flex-row items-center gap-x-3 text-sm font-normal">
          <Button
            variant={"primary"}
            size={"sm"}
            className="w-full justify-start"
          >
            <Edit className="h-4 w-4 mr-2" /> Click to invite member
          </Button>
        </div>
      </FormInvite>
    </>
  );
};

Content.Skeleton = function SkeletonContent() {
  return (
    <div className="flex flex-row items-center gap-x-3">
      <ArchiveIcon className="h-4 w-4 text-gray-500" />
      <div className="w-20 h-4 bg-gray-200 rounded-md" />
    </div>
  );
};

export default Content;
