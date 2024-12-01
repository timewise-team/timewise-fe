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
import { checkSchedulePermission, ScheduleAction } from "@/constants/roles";
import { getUserEmailByWorkspace } from "@/utils/userUtils";
import { useStateContext } from "@/stores/StateContext";

interface Props {
  data: any;
}

const Content = ({ data }: Props) => {
  const { data: session } = useSession();
  const params = useParams();
  const { stateWorkspacesByEmail, stateUserEmails } = useStateContext();

  const userEmail = getUserEmailByWorkspace(
    stateUserEmails,
    stateWorkspacesByEmail,
    Number(data.workspace_id)
  );

  const { data: scheduleParticipant } = useQuery<Participant>({
    queryKey: ["scheduleParticipant"],
    queryFn: async () => {
      const response = await getScheduleByID(
        {
          schedule_id: data.id,
          organizationId: params.organizationId || data.workspace_id,
          userEmail: userEmail?.email,
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
      const fetchedReminders = await getReminderParticipant(
        {
          schedule_id: data.id,
          organizationId: params.organizationId || data.workspace_id,
          userEmail: userEmail?.email,
        },
        session
      );
      fetchedReminders.workspaceId = data.workspace_id;

      return fetchedReminders;
    },
    enabled: !!data.id && !!session,
  });

  const { data: personalReminder } = useQuery({
    queryKey: ["personalReminder"],
    queryFn: async () => {
      const fetchedPersonalReminder = await getReminderPersonal(
        {
          schedule_id: data.id,
          organizationId: params.organizationId || data.workspace_id,
          userEmail: userEmail?.email,
        },
        session
      );
      fetchedPersonalReminder.workspaceId = data.workspace_id;
      return fetchedPersonalReminder;
    },
    enabled: !!data.id && !!session,
  });

  const { data: documents } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await getDocumentByScheduleID(
        {
          cardId: data.id,
          organizationId: params.organizationId || data.workspace_id,
          userEmail: userEmail?.email,
        },
        session
      );
      return response;
    },
    enabled: !!data.id && !!session,
  });

  return (
    <>
      <div className="flex items-start flex-col justify-between w-full">
        <Visibility
          data={data}
          disabled={
            !checkSchedulePermission(data.extra_data, ScheduleAction.visibility)
          }
        />
        <Status
          data={data}
          disabled={
            !checkSchedulePermission(data.extra_data, ScheduleAction.status)
          }
        />
        <DatePicker
          data={data}
          disabled={
            !checkSchedulePermission(data.extra_data, ScheduleAction.date)
          }
        />
        <p className="font-bold text-gray-400">Reminders</p>
        <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
          <AllReminder
            data={allReminder}
            disabled={
              !checkSchedulePermission(
                data.extra_data,
                ScheduleAction.reminder_participant
              )
            }
          />
        </div>
        <div className="flex flex-row items-center gap-x-3 text-sm font-bold">
          <PersonalReminder
            data={personalReminder}
            schedule={data}
            disabled={
              !checkSchedulePermission(
                data.extra_data,
                ScheduleAction.reminder_personal
              )
            }
          />
        </div>
      </div>

      <div className=" flex flex-row items-center gap-x-2 text-md font-bold text-gray-400">
        <PersonStanding className="h-6 w-6" />
        Assignee:
        <p className="text-yellow-500">{scheduleParticipant?.email}</p>
        <div className="flex flex-row items-center gap-x-1">
          <Assignee
            data={data}
            participant={scheduleParticipant}
            disabled={
              !checkSchedulePermission(data.extra_data, ScheduleAction.assign)
            }
          >
            <div className="cursor-pointer flex flex-row items-center gap-x-3 text-sm font-bold">
              <Button
                variant={"primary"}
                size={"sm"}
                className="w-full justify-start bg-white text-black hover:bg-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Assign
              </Button>
            </div>
          </Assignee>
        </div>
      </div>
      <div className="flex flex-row items-center gap-x-2 text-md font-medium text-gray-400">
        <Theater className="h-6 w-6 items-center text-gray-400 text-md" />
        <p className="text-gray-400 font-bold">Tags: </p>
        <div className="flex flex-row items-center gap-x-1">
          <span
            className={
              "ml-12 w-fit px-2 py-1 leading-tight inline-flex items-center bg-teal-100 rounded"
            }
          >
            <Gauge className="h-3 w-3 " />
            <span className={"text-sm ml-2  font-medium text-teal-900"}>
              Board
            </span>
          </span>
        </div>
      </div>

      {/* attachment */}
      <div className="font-bold text-gray-400 ">
        <div className="flex flex-row gap-x-2">
          <ArchiveIcon className="h-6 w-6 text-gray-400" />
          Attachment:
        </div>
        <Document
          data={data}
          document={documents}
          disabled={
            !checkSchedulePermission(data.extra_data, ScheduleAction.document)
          }
        />
      </div>
      <FormInvite
        data={data}
        disabled={
          !checkSchedulePermission(data.extra_data, ScheduleAction.invite)
        }
      >
        {/* invite member to schedule */}
        <div className="cursor-pointer flex flex-row items-center gap-x-3 text-sm font-bold ">
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
