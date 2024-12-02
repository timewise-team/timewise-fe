/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useStateContext } from "@/stores/StateContext";
import { useQuery } from "@tanstack/react-query";
import { getSchedules } from "@/lib/fetcher";
import CalendarApp from "@components/view-calender/calender";
import {
  Calendars,
  getWorkspaceData,
  transformScheduleData,
} from "@/utils/calendar/calendarUtils";
import { useParams } from "next/navigation";
import { Workspace } from "@/types/Board";
import AddSchedule from "../_components/add-schedule";

const getWorkspaceById = (
  stateWorkspacesByEmail: Record<string, Workspace[]>,
  workspaceId: number
): Workspace | undefined => {
  for (const email in stateWorkspacesByEmail) {
    const workspace = stateWorkspacesByEmail[email].find(
      (ws) => ws.ID === workspaceId
    );
    if (workspace) {
      return workspace; // Return the workspace as soon as it's found
    }
  }
  return undefined; // Return undefined if not found
};

const WorkspaceCalender = () => {
  const { data: session } = useSession();
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const { stateWorkspacesByEmail } = useStateContext();
  const [workspaceData, setWorkspaceData] = useState<Calendars>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const params = useParams();

  const openDialog = () => setIsDialogOpen(true);
  //openDialog();
  const closeDialog = () => {
    console.log(isDialogOpen);
    setIsDialogOpen(false);
  };

  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {});
  };

  // const handleCheckedWorkspacesChange = (checkedWorkspaces: string[]) => {
  //   setCheckedWorkspaces(checkedWorkspaces);
  // };

  const { data, isLoading } = useQuery({
    queryKey: ["schedules", params.organizationId],
    queryFn: async () => {
      const currentWorkspace = getWorkspaceById(
        stateWorkspacesByEmail,
        Number(params.organizationId)
      );
      if (!currentWorkspace) {
        return [];
      }

      const payload = {
        checkedWorkspaces: [currentWorkspace.ID],
        startTime: "0001-10-01 00:00:00.000",
        endTime: "9999-12-31 23:59:59.000",
        isDeleted: false,
      };
      const response = await getSchedules(payload, session);
      return response || [];
    },
    enabled: !!session && !!stateWorkspacesByEmail,
  });

  const boardId = data?.map((schedule: any) => schedule.board_column_id);
  const firstBoardId = boardId ? boardId[0] : null;

  useEffect(() => {
    const transformedWorkspaceData = getWorkspaceData(stateWorkspacesByEmail);
    setWorkspaceData(transformedWorkspaceData);
  }, [stateWorkspacesByEmail]);

  useEffect(() => {
    if (!isLoading && data) {
      setScheduleData(transformScheduleData(data));
    }
  }, [isLoading, data]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="flex items-center justify-start w-full">
        <AddSchedule
          listId={firstBoardId}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
          isGlobalCalendar={true}
          boardId={firstBoardId}
          closeDialog={closeDialog}
          openDialog={openDialog}
        />
      </div>
      {stateWorkspacesByEmail && (
        <div className="w-full max-w-[100vw] h-full flex gap-1">
          <CalendarApp
            scheduleData={scheduleData}
            workspaceData={workspaceData}
          />
        </div>
      )}
    </div>
  );
};

export default WorkspaceCalender;
