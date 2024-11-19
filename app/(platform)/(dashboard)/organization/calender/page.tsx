"use client";
import React, {useEffect, useState} from "react";
import CalendarApp from "@/components/view-calender/calender";
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {getSchedules} from "@/lib/fetcher";
import {Schedule, TransformedSchedule} from "@/types/Calendar";
import {useStateContext} from "@/stores/StateContext";
import CalendarFilter from "@components/view-calender/calendar-filter";
import {format, parseISO} from "date-fns";

const transformScheduleData = (data: Schedule[]): TransformedSchedule[] => {
    return data.map((schedule: Schedule) => {
        let start, end = "";
        if (schedule.all_day) {
            start = format(parseISO(schedule.start_time), "yyyy-MM-dd");
            end = format(parseISO(schedule.end_time), "yyyy-MM-dd");
        } else {
            start = format(parseISO(schedule.end_time), "yyyy-MM-dd HH:mm");
            end = format(parseISO(schedule.end_time), "yyyy-MM-dd HH:mm");
        }
        return {
            id: schedule.id.toString(),
            title: schedule.title,
            with: "",
            start: start,
            end: end,
            color: "",
            isEditable: false,
            location: schedule.location,
            topic: "",
        };
    });
};

const CalenderPage = () => {
    const {data: session} = useSession();
    const [scheduleData, setScheduleData] = useState<TransformedSchedule[]>([]);
    const [checkedWorkspaces, setCheckedWorkspaces] = useState<string[]>([]);
    const {stateWorkspacesByEmail} = useStateContext();

    const handleCheckedWorkspacesChange = (checkedWorkspaces: string[]) => {
        setCheckedWorkspaces(checkedWorkspaces);
    };

    const {data, isLoading} = useQuery({
        queryKey: ["schedules", checkedWorkspaces],
        queryFn: async () => {
            if (checkedWorkspaces.length === 0) {
                return [];
            }

            const payload = {
                checkedWorkspaces,
                startTime: "0001-10-01 00:00:00.000",
                endTime: "9999-12-31 23:59:59.000",
                isDeleted: false
            };
            const response = await getSchedules(payload, session);
            return response || [];
        },
        enabled: !!session
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
            {stateWorkspacesByEmail &&
                <div className="w-full max-w-[100vw] h-full flex gap-1">
                    <CalendarFilter workspaceData={stateWorkspacesByEmail}
                                    onCheckedWorkspacesChange={handleCheckedWorkspacesChange}/>
                    <CalendarApp scheduleData={scheduleData}/>
                </div>
            }
        </div>
    );
};

export default CalenderPage;
