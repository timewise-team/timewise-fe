"use client";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {TransformedSchedule} from "@/types/Calendar";
import {useStateContext} from "@/stores/StateContext";
import {useQuery} from "@tanstack/react-query";
import {getSchedules} from "@/lib/fetcher";
import CalendarApp from "@components/view-calender/calender";
import {transformScheduleData} from "@/utils/calendar/calendarUtils";
import {useParams} from "next/navigation";
import {Workspace} from "@/types/Board";

const getWorkspaceById = (
    stateWorkspacesByEmail: Record<string, Workspace[]>,
    workspaceId: number
): Workspace | undefined => {
    for (const email in stateWorkspacesByEmail) {
        const workspace = stateWorkspacesByEmail[email].find((ws) => ws.ID === workspaceId);
        if (workspace) {
            return workspace; // Return the workspace as soon as it's found
        }
    }
    return undefined; // Return undefined if not found
}


const WorkspaceCalender = () => {
    const {data: session} = useSession();
    const [scheduleData, setScheduleData] = useState<TransformedSchedule[]>([]);
    const {stateWorkspacesByEmail} = useStateContext();
    const params = useParams();

    // const handleCheckedWorkspacesChange = (checkedWorkspaces: string[]) => {
    //   setCheckedWorkspaces(checkedWorkspaces);
    // };

    const {data, isLoading} = useQuery({
        queryKey: ["schedules", stateWorkspacesByEmail],
        queryFn: async () => {
            const currentWorkspace = getWorkspaceById(stateWorkspacesByEmail, Number(params.organizationId));
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

    useEffect(() => {
        if (!isLoading && data) {
            setScheduleData(transformScheduleData(data));
        }
    }, [isLoading, data]);

    if (!scheduleData) {
        return <div className="w-full h-full">Loading...</div>;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
            {stateWorkspacesByEmail && (
                <div className="w-full max-w-[100vw] h-full flex gap-1">
                    {/*<CalendarFilter*/}
                    {/*    workspaceData={stateWorkspacesByEmail}*/}
                    {/*    onCheckedWorkspacesChange={handleCheckedWorkspacesChange}*/}
                    {/*/>*/}
                    <CalendarApp scheduleData={scheduleData}/>
                </div>
            )}
        </div>
    );
};

export default WorkspaceCalender;
