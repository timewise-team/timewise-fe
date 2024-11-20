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
import {
  getDocumentByScheduleID,
  getReminderParticipant,
  getReminderPersonal,
  getScheduleByID,
} from "@/lib/fetcher";
import AllReminder from "./all-reminder";
import PersonalReminder from "./personal-reminder";
import Document from "./document";
import Visibility from "./Visibility";
import Status from "./status";

interface Props {
  data: any;
}

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

  const { data: allReminder } = useQuery({
    queryKey: ["allReminder"],
    queryFn: async () => {
      const response = await getReminderParticipant(
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

  const { data: personalReminder } = useQuery({
    queryKey: ["personalReminder"],
    queryFn: async () => {
      const response = await getReminderPersonal(
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

  return (
    <>
      <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
        <Visibility data={data} />
      </div>
      <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
        <Status />
      </div>

      <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
        <DatePicker data={data} />
      </div>
      <div className="flex flex-col items-start space-y-1">
        <p className="font-bold">Reminders</p>
        <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
          <AllReminder data={allReminder} />
        </div>
        <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
          <PersonalReminder data={personalReminder} schedule={data} />
        </div>
      </div>

      <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
        <PersonStanding className="h-4 w-4 items-center" />
        Assignee:
        <p className="text-yellow-500">{scheduleParticipant?.email}</p>
        <div className="flex flex-row items-center gap-x-1">
          <Assignee data={data}>
            <div className="cursor-pointer flex flex-row items-center gap-x-3 text-sm font-bold">
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
      <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
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
      <div className="flex flex-col gap-x-3 text-sm font-bold space-y-2">
        <div className="flex flex-row gap-x-2">
          <ArchiveIcon className="h-4 w-4 text-gray-500" />
          Attachment:
        </div>

        <Document data={data} document={documents} />
      </div>
      <FormInvite data={data}>
        {/* invite member to schedule */}
        <div className="cursor-pointer flex flex-row items-center gap-x-3 text-sm font-bold">
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
