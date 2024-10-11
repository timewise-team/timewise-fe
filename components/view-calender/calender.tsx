/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";
import {
  viewDay,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from "@schedule-x/calendar";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createResizePlugin } from "@schedule-x/resize";
import { useEffect } from "react";
import { seededEvents } from "./seeded-events";

function CalendarApp() {
  // const plugins = [createEventsServicePlugin()];

  const calendarApp = useNextCalendarApp({
    views: [viewWeek, viewMonthAgenda, viewDay, viewMonthGrid],
    defaultView: viewMonthGrid.name,
    events: seededEvents,
    plugins: [
      createDragAndDropPlugin(),
      createEventModalPlugin(),
      createResizePlugin(),
    ],
    selectedDate: "2024-09-01",
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
    if (calendarApp) {
      (calendarApp as any).eventsService.getAll();
    }
  }, []);

  return (
    <div className="w-full max-w-[100vw] h-[800px] max-h-[90vw]">
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  );
}

export default CalendarApp;
