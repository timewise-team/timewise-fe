/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {useQuery} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import "@schedule-x/theme-default/dist/index.css";
import {viewDay, viewMonthAgenda, viewMonthGrid, viewWeek, CalendarEvent } from "@schedule-x/calendar";
import {createDragAndDropPlugin} from "@schedule-x/drag-and-drop";
import {createEventModalPlugin} from "@schedule-x/event-modal";
import {createResizePlugin} from "@schedule-x/resize";
import {ScheduleXCalendar, useNextCalendarApp} from "@schedule-x/react";
import {useState} from "react";

function CalendarApp() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState("");
  const fetchSchedule = async () => {
    const token = session?.user?.access_token;
    const email = session?.user?.email;
    if (!token || !email) throw new Error("Token or email not found");

    const responseWspId = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspace/get-workspaces-by-email/` + email, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/schedule/schedule`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    const result = await response.json();
    console.log(result);
    return result;
  };

  const { data: events = [] , isLoading, isError } = useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
    enabled: !!session,
  });
  interface Event {
    id: number;
    workspace_id: number;
    board_column_id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    status: string;
    all_day: boolean;
    visibility: string;
    video_transcript: string | null;
    extra_data: string;
    is_deleted: boolean;
    recurrence_pattern: string;
    position: number;
    priority: string;
  }

  const mapEventDates = (events: Event[]): CalendarEvent[] => {
    return events
        .filter((event) => !event.is_deleted) // Only include non-deleted events
        .map((event) => {
          const isDefaultDate = event.start_time === "0001-01-01T00:00:00Z";
          const startDate = isDefaultDate ? new Date(event.created_at) : new Date(event.start_time);
          const endDate = isDefaultDate ? new Date(event.created_at) : new Date(event.end_time);
          console.log({
            ...event,
            start: startDate,
            end: endDate,
            title: event.title,
            allDay: event.all_day,
          });
          return {
            ...event,
            start: isDefaultDate ? event.created_at : event.start_time,
            end: isDefaultDate ? event.created_at : event.end_time,
            title: event.title, // Map any additional properties as needed
            allDay: event.all_day,
          } as CalendarEvent;
        });
  };

  const calendarApp = useNextCalendarApp({
    views: [viewWeek, viewMonthAgenda, viewDay, viewMonthGrid],
    defaultView: viewMonthGrid.name,
    events: mapEventDates(events), // Pass transformed events
    plugins: [
      createDragAndDropPlugin(),
      createEventModalPlugin(),
      createResizePlugin(),
    ],
    selectedDate: "2024-09-01",
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading schedule.</div>;

  return (
      <div className="w-full max-w-[100vw] h-[800px] max-h-[90vw]">
        {/* Filter Dropdown */}
        <div className="filter-controls">
          <label htmlFor="event-type-filter">Filter by event type:</label>
          <select
              id="event-type-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="meeting">Meeting</option>
            <option value="deadline">Deadline</option>
            <option value="holiday">Holiday</option>
            {/* Add other event types as needed */}
          </select>
        </div>

        {/* Calendar Component */}
        <ScheduleXCalendar calendarApp={calendarApp}/>
      </div>
  );
}

export default CalendarApp;
