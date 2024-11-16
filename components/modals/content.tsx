/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  ArchiveIcon,
  Edit,
  Gauge,
  PersonStanding,
  Theater,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/Button";
import { DatePicker } from "./date-picker";
import FormInvite from "../form/form-invite";
import Assignee from "./assignee";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Participant } from "@/types/Board";
import { getScheduleByID } from "@/lib/fetcher";

interface Props {
  data: any;
}

export const getDocumentByScheduleID = async (params: any, session: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/document/schedule/${params.cardId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.access_token}`,
        "X-User-Email": `${session?.user.email}`,
        "X-Workspace-ID": `${params.organizationId || params.workspace_id}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

const Content = ({ data }: Props) => {
  const { data: session } = useSession();
  const params = useParams();

  const { data: scheduleParticipant } = useQuery<Participant>({
    queryKey: ["scheduleParticipant"],
    queryFn: async () => {
      const response = await getScheduleByID(
        {
          schedule_id: data.id,
          organizationId: params.organizationId,
        },
        session
      );
      return response;
    },
    enabled: !!data.id && !!session,
  });

  const { data: documents } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await getDocumentByScheduleID(
        {
          cardId: data.id,
          organizationId: params.organizationId,
        },
        session
      );
      return response;
    },
    enabled: !!data.id && !!session,
  });

  console.log("documents", documents);
  console.log("data content", data);

  return (
    <>
      <div className="flex flex-row items-center gap-x-3 text-sm font-normal">
        <DatePicker data={data} />
      </div>
      {/* <div className="flex flex-row items-center gap-x-3 text-sm font-normal">
        <ArchiveIcon className="h-4 w-4 text-gray-500" />
        Create By: {data.first_name} {data.last_name}
      </div> */}

      <div className="flex flex-row items-center gap-x-3 text-sm font-normal">
        <PersonStanding className="h-4 w-4 items-center" />
        Assignee:
        <p className="text-yellow-500">{scheduleParticipant?.email}</p>
        <div className="flex flex-row items-center gap-x-1">
          <Assignee data={data}>
            <div className="cursor-pointer flex flex-row items-center gap-x-3 text-sm font-normal">
              <Button
                variant={"primary"}
                size={"sm"}
                className="w-full justify-start"
              >
                <Edit className="h-4 w-4 mr-2" /> Click to assign member
              </Button>
            </div>
          </Assignee>
        </div>
      </div>
      <div className="flex flex-row items-center gap-x-3 text-sm font-normal">
        <Theater className="h-4 w-4 items-center" />
        Tags:
        <div className="flex flex-row items-center gap-x-1">
          <span
            className={
              "w-fit px-2 py-1 leading-tight inline-flex items-center bg-teal-100 rounded"
            }
          >
            <Gauge className="h-3 w-3 " />
            <span className={"text-sm ml-2 font-medium text-teal-900"}>
              Board
            </span>
          </span>
        </div>
      </div>

      {/* attachment */}
      <div className="flex flex-row gap-x-3 text-sm font-normal">
        <ArchiveIcon className="h-4 w-4 text-gray-500" />
        Attachment:
        {/* <Document data={documents} /> */}
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
