/* eslint-disable @typescript-eslint/no-explicit-any */
import {Schedule, TransformedSchedule} from "@/types/Calendar";
import {format, parseISO} from "date-fns";

export const transformScheduleData = (data: any): TransformedSchedule[] => {
    if (!Array.isArray(data)) {
        console.error("Expected an array, received:", data);
        return [];
    }
    return data.map((schedule: Schedule) => {
        let start,
            end = "";
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
            workspaceId: schedule.workspace_id,
        };
    });
};