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
            createEventsServicePlugin(),
            createCalendarControlsPlugin()
        ],
        selectedDate: format(new Date(), 'yyyy-MM-dd'),
        calendars: workspaceData,
    }) as any;

    useEffect(() => {
        if (calendarApp) {
            calendarApp.eventsService.set(scheduleData);
        }
    }, [scheduleData, calendarApp]);

    useEffect(() => {
        const handleClick = (event: Event) => {
            const target = event.target as HTMLElement;
            const eventId = target.closest(".sx__time-grid-event")?.getAttribute("data-event-id")
                || target.closest(".sx__month-grid-event")?.getAttribute("data-event-id");
            if (eventId) {
                const workspaceId = calendarApp.eventsService.get(eventId.toString()).workspaceId;
                cardModal.onOpen(eventId.toString(), workspaceId.toString());
            }
        };

        const attachEventListeners = () => {
            const eventElements = document.querySelectorAll(".sx__time-grid-event")
                && document.querySelectorAll(".sx__month-grid-event");
            eventElements.forEach((element) => {
                element.addEventListener("click", handleClick);
            });
        };

        // Initial attachment of event listeners
        attachEventListeners();

        // Observe changes in the DOM to re-attach event listeners
        const observer = new MutationObserver(() => {
            attachEventListeners();
        });

        observer.observe(document.body, {childList: true, subtree: true});

        return () => {
            observer.disconnect();
            const eventElements = document.querySelectorAll(".sx__time-grid-event")
                || document.querySelectorAll(".sx__month-grid-event");
            eventElements.forEach((element) => {
                element.removeEventListener("click", handleClick);
            });
        };
    }, [calendarApp, cardModal]);

    return (
        <div className="w-full max-w-[100vw] h-full">
            <ScheduleXCalendar calendarApp={calendarApp}/>
            {isModalOpen && <ScheduleDetailsDrawer eventId={selectedEventId}/>}
        </div>
    );
}

export default CalendarApp;