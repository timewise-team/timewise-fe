"use client";
import React, {useEffect, useState} from "react";
import {ScheduleXCalendar, useNextCalendarApp} from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";
import {viewDay, viewMonthAgenda, viewMonthGrid, viewWeek} from "@schedule-x/calendar";
import {createDragAndDropPlugin} from "@schedule-x/drag-and-drop";
import {createEventModalPlugin} from "@schedule-x/event-modal";
import {createResizePlugin} from "@schedule-x/resize";
import {format} from "date-fns";
import {createCalendarControlsPlugin} from "@schedule-x/calendar-controls";
import ScheduleDetailsDrawer from "@components/view-calender/custom-event-modal";
import {useCardModal} from "@/hooks/useCardModal";
import {TransformedSchedule} from "@/types/Calendar";

interface CalendarAppProps {
    scheduleData: TransformedSchedule[];
}

function CalendarApp({scheduleData}: CalendarAppProps) {
    const [isModalOpen] = useState(false);
    const [selectedEventId] = useState<string | null>(null);
    const cardModal = useCardModal();

    const calendarApp = useNextCalendarApp({
        views: [viewWeek, viewMonthAgenda, viewDay, viewMonthGrid],
        defaultView: viewMonthGrid.name,
        events: scheduleData,
        plugins: [
            // createDragAndDropPlugin(),
            // createResizePlugin(),
            createCalendarControlsPlugin()
        ],
        selectedDate: format(new Date(), 'yyyy-MM-dd'),
        calendars: {
            personal: {
                colorName: "personal",
                lightColors: {
                    main: "#f9d71c",
                    container: "#fff5aa",
                    onContainer: "#594800",
                },
                darkColors: {
                    main: "#fff5c0",
                    onContainer: "#fff5de",
                    container: "#a29742",
                },
            },
            work: {
                colorName: "work",
                lightColors: {
                    main: "#f91c45",
                    container: "#ffd2dc",
                    onContainer: "#59000d",
                },
                darkColors: {
                    main: "#ffc0cc",
                    onContainer: "#ffdee6",
                    container: "#a24258",
                },
            },
            leisure: {
                colorName: "leisure",
                lightColors: {
                    main: "#1cf9b0",
                    container: "#dafff0",
                    onContainer: "#004d3d",
                },
                darkColors: {
                    main: "#c0fff5",
                    onContainer: "#e6fff5",
                    container: "#42a297",
                },
            },
            school: {
                colorName: "school",
                lightColors: {
                    main: "#1c7df9",
                    container: "#d2e7ff",
                    onContainer: "#002859",
                },
                darkColors: {
                    main: "#c0dfff",
                    onContainer: "#dee6ff",
                    container: "#426aa2",
                },
            },
        },
    });

    useEffect(() => {
        const handleClick = (event: Event) => {
            const target = event.target as HTMLElement;
            const eventId = target.closest(".sx__time-grid-event")?.getAttribute("data-event-id")
                || target.closest(".sx__month-grid-event")?.getAttribute("data-event-id");
            if (eventId) {
                console.log("Event ID:", eventId);
                cardModal.onOpen(eventId.toString(), "38");
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
    }, [calendarApp]);

    // useEffect(() => {
    //     if (calendarApp && calendarApp.calendarControls) {
    //         const updateRange = () => {
    //             const range = calendarApp.calendarControls.getRange();
    //             console.log("Calendar range:", range);
    //         };
    //
    //         // Initial range fetch
    //         updateRange();
    //     }
    // }, [calendarApp]);

    // todo: handle change view or date range to fetch schedules

    return (
        <div className="w-full max-w-[100vw] h-full">
            <ScheduleXCalendar calendarApp={calendarApp}/>
            {isModalOpen && <ScheduleDetailsDrawer eventId={selectedEventId}/>}
        </div>
    );
}

export default CalendarApp;