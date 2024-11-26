/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, {useEffect, useState} from "react";
import {ScheduleXCalendar, useNextCalendarApp} from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";
import {viewDay, viewMonthAgenda, viewMonthGrid, viewWeek} from "@schedule-x/calendar";
import {format} from "date-fns";
import {createCalendarControlsPlugin} from "@schedule-x/calendar-controls";
import {createEventsServicePlugin} from '@schedule-x/events-service';
import ScheduleDetailsDrawer from "@components/view-calender/custom-event-modal";
import {useCardModal} from "@/hooks/useCardModal";
import {TransformedSchedule} from "@/types/Calendar";
import {Calendars} from "@/utils/calendar/calendarUtils";
import {createDragAndDropPlugin} from "@schedule-x/drag-and-drop";

interface CalendarAppProps {
    scheduleData: TransformedSchedule[];
    workspaceData: Calendars;
}

function CalendarApp({scheduleData, workspaceData}: CalendarAppProps) {
    const [isModalOpen] = useState(false);
    const [selectedEventId] = useState<string | null>(null);
    const cardModal = useCardModal();

    const calendarApp = useNextCalendarApp({
        views: [viewWeek, viewMonthAgenda, viewDay, viewMonthGrid],
        defaultView: viewMonthGrid.name,
        events: scheduleData,
        plugins: [
            createDragAndDropPlugin(15),
            createEventsServicePlugin(),
            createCalendarControlsPlugin()
        ],
        selectedDate: format(new Date(), 'yyyy-MM-dd'),
        calendars: workspaceData,
        callbacks: {
            onEventClick: (event) => {
                console.log('Event clicked:', event);
                cardModal.onOpen(event.id.toString(), event.workspaceId);
            },
            onClickDate(date) {
                console.log('onClickDate', date) // e.g. 2024-01-01
            },
            onClickDateTime(dateTime) {
                console.log('onClickDateTime', dateTime) // e.g. 2024-01-01T12:00:00
            },
            onEventUpdate(event) {
                console.log('onEventUpdate', event)
            }
        }
    }) as any;

    useEffect(() => {
        if (calendarApp) {
            calendarApp.eventsService.set(scheduleData);
        }
    }, [scheduleData, calendarApp]);

    return (
        <div className="w-full max-w-[100vw] h-full">
            <ScheduleXCalendar calendarApp={calendarApp}/>
            {isModalOpen && <ScheduleDetailsDrawer eventId={selectedEventId}/>}
        </div>
    );
}

export default CalendarApp;