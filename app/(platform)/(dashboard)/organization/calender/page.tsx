"use client";
import React, {useEffect, useState} from "react";
import CalendarApp from "@/components/view-calender/calender";
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {getSchedules} from "@/lib/fetcher";
import {Workspace} from "@/types/Board";
import {useLinkedEmails} from "@/hooks/useLinkedEmail";
import {Schedule, TransformedSchedule} from "@/types/Calendar";

const transformScheduleData = (data: Schedule[]): TransformedSchedule[] => {
    return data.map((schedule: Schedule) => {
        return {
            id: schedule.id.toString(),
            title: schedule.title,
            with: "Khanh Hoang",
            start: schedule.start_time.replace("T", " ").substring(0, 16),
            end: schedule.end_time.replace("T", " ").substring(0, 16),
            color: "blue", // Assuming a default color
            isEditable: true, // Assuming all events are editable
            location: schedule.location + "123",
            topic: "test",
        };
    });
};

const CalenderPage = () => {
    const {data: session} = useSession();
    const {linkedEmails} = useLinkedEmails();
    const [scheduleData, setScheduleData] = useState<TransformedSchedule[]>([]);

    const {data: workspaceData} = useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            if (!linkedEmails) return [];

            const allWorkspaces = await Promise.all(linkedEmails.map(async (email) => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/get-workspaces-by-email/${email}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${session?.user.access_token}`,
                        },
                    }
                );
                const data = await response.json();
                return data.map((workspace: Workspace) => workspace);
            }));
            return allWorkspaces.flat();
        },
        enabled: !!session,
    });

    const {data, isLoading} = useQuery({
        queryKey: ["schedules"],
        queryFn: async () => {
            if (!workspaceData) return [];
            const workspaceIds = workspaceData.map((workspace: Workspace) => workspace.ID);

            // const currentDate = new Date();
            // const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));
            // const endOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 7));

            const payload = {
                workspaceIds,
                // startTime: format(startOfWeek, "yyyy-MM-dd HH:mm:ss.SSS"),
                // endTime: format(endOfWeek, "yyyy-MM-dd HH:mm:ss.SSS"),
                startTime: '2010-10-01 00:00:00.000',
                endTime: '2025-12-31 23:59:59.000',
            };
            return await getSchedules(payload, session);
        }
    });

    useEffect(() => {
        if (!isLoading && data) {
            setScheduleData(transformScheduleData(data));
        }
    }, [isLoading, data]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {scheduleData.length > 0 && <CalendarApp scheduleData={scheduleData}/>}
        </div>
    );
};

export default CalenderPage;